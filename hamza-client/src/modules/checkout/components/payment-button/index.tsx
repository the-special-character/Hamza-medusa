'use client';

import { Cart, PaymentSession } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import { placeOrder } from '@modules/checkout/actions';
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../error-message';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ITransactionOutput } from 'web3';
import { MasterSwitchClient } from 'web3/master-switch-client';
import { ethers } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';

type PaymentButtonProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

// Extend the Window interface
declare global {
    interface Window {
        ethereum: ethers.Eip1193Provider;
    }
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
    const notReady =
        !cart ||
        !cart.shipping_address ||
        !cart.billing_address ||
        !cart.email ||
        cart.shipping_methods.length < 1
            ? true
            : false;

    const paymentSession = cart.payment_session as PaymentSession;

    switch (paymentSession.provider_id) {
        case 'manual':
            return <ManualTestPaymentButton notReady={notReady} />;
        case 'crypto':
            return <CryptoPaymentButton notReady={notReady} cart={cart} />;
        default:
            return <ManualTestPaymentButton notReady={notReady} />;
    }
};

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onPaymentCompleted = async () => {
        await placeOrder().catch((err) => {
            setErrorMessage(err.toString());
            setSubmitting(false);
        });
    };

    const handlePayment = () => {
        setSubmitting(true);
        onPaymentCompleted();
    };

    return (
        <>
            <Button
                disabled={notReady}
                isLoading={submitting}
                onClick={handlePayment}
                size="large"
            >
                Place order: Manual
            </Button>
            <ErrorMessage error={errorMessage} />
        </>
    );
};

// TODO: (For G) Typescriptify this function with verbose error handling
const CryptoPaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    notReady: boolean;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const completeCart = useCompleteCart(cart.id);
    const updateCart = useUpdateCart(cart.id);
    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
    const router = useRouter();
    const { connect, connectors, error, isLoading, pendingConnector } =
        useConnect({
            connector: new InjectedConnector(),
        });

    // Check if a wallet is connected, console log results
    console.log('isConnected: ', isConnected);

    // connector: activeConnector extracts connector object from useAccount hook (provides active wallet connection data)
    console.log('activeConnector: ', activeConnector);

    // useEffect hook to check if connection status changes
    // if !isConnected, connect to wallet
    useEffect(() => {
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        }
    }, [openConnectModal, isConnected]);

    //RETURNS TRANSACTION ID
    const makePayment = async (receiver: string) => {
        try {
            const session = cart.payment_session as PaymentSession;
            const provider = new ethers.BrowserProvider(
                window.ethereum,
                11155111
            ); //TODO: get chain dynamically
            const signer = await provider.getSigner();

            console.log('payer: ', signer.address);
            console.log('receiver: ', receiver);

            const switchClient: MasterSwitchClient = new MasterSwitchClient(
                provider,
                signer,
                '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A' //TODO: get contract address dynamically
            );

            console.log('created switch client');
            const output: ITransactionOutput =
                await switchClient.placeMultiplePayments([
                    {
                        receiver: receiver,
                        currency: 'eth',
                        payments: [
                            {
                                id: Math.floor(Math.random() * 9999) + 1, //TODO: use real order id
                                payer: signer.address ?? '',
                                receiver: receiver,
                                amount: session.amount,
                            },
                        ],
                    },
                ]);

            console.log(output);
            console.log('TX ID: ', output.transaction_id);
            return output.transaction_id;
        } catch (e) {
            console.error('error has occured during transaction', e);
        }

        return '';
    };

    const onPaymentCompleted = async (transactionId: string) => {
        updateCart.mutate(
            { context: { transactionId } },
            {
                onSuccess: ({}) => {
                    console.log('updated cart successfully');
                    completeCart.mutate(void 0, {
                        onSuccess: ({ data, type }) => {
                            console.log('completed cart successfully');
                            setSubmitting(false);
                            const countryCode =
                                cart.shipping_address?.country_code?.toLowerCase();
                            //Todo Add redirection after the payment is captured in order service
                            // router.push(
                            //     `/${countryCode}/order/confirmed/${cart.id}`
                            // );
                        },
                    });
                },
            }
        );
    };

    const session = cart.payment_session as PaymentSession;

    const handlePayment = async () => {
        try {
            setSubmitting(true);

            //here connect wallet and sign in, if not connected
            connect();
            //get the transaction id from payment
            let receiver_address = '';
            const walletAddresses: any = session.data.wallet_addresses;
            if (walletAddresses?.length) {
                const addresses = walletAddresses.split(',');
                receiver_address = addresses[0];
            }

            const transactionId: string = await makePayment(receiver_address);

            //pass the transaction id back to the provider
            if (transactionId?.length) onPaymentCompleted(transactionId);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <Button
                size="large"
                isLoading={submitting}
                disabled={notReady}
                color="white"
                onClick={handlePayment}
            >
                Place Order: Crypto
            </Button>
            <ErrorMessage error={errorMessage} />
        </>
    );
};

export default PaymentButton;
