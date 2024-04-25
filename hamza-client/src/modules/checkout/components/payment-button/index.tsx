'use client';

import { Cart, PaymentSession } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import { placeOrder } from '@modules/checkout/actions';
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../error-message';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ITransactionOutput, IMultiPaymentInput } from 'web3';
import { MasterSwitchClient } from 'web3/master-switch-client';
import { ethers } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';
const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';

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
    const doWalletPayment = async (data: any) => {
        try {
            //get provider and such
            const provider = new ethers.BrowserProvider(
                window.ethereum,
                11155111
            ); //TODO: get chain dynamically
            const signer: ethers.Signer = await provider.getSigner();

            //create the contract client
            const switchClient: MasterSwitchClient = new MasterSwitchClient(
                provider,
                signer,
                '0x8bA35513C3F5ac659907D222e3DaB38b20f8F52A' //TODO: get contract address dynamically
            );

            //create the inputs
            const switchInput: IMultiPaymentInput[] = await createSwitchInput(
                data,
                await signer.getAddress()
            );
            const output: ITransactionOutput =
                await switchClient.placeMultiplePayments(switchInput);

            console.log(output);
            console.log('TX ID: ', output.transaction_id);
            return output.transaction_id;
        } catch (e) {
            console.error('error has occured during transaction', e);
        }

        return '';
    };

    const retrieveCheckoutData = async (cartId: string) => {
        const response = await fetch(
            `${MEDUSA_SERVER_URL}/custom/checkout?cart_id=${cartId}`
        );
        if (response.status == 200) {
            const data = await response.json();
            return data;
        }
        return {};
    };

    const createSwitchInput = async (data: any, payer: string) => {
        if (data.orders) {
            const switchInput: IMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                const input: IMultiPaymentInput = {
                    currency: o.currency_code,
                    receiver: o.wallet_address,
                    payments: [
                        {
                            id: o.order_id,
                            payer: payer,
                            amount: o.amount,
                            currency: o.currency_code,
                            receiver: o.wallet_address,
                        },
                    ],
                };
                switchInput.push(input);
            });

            return switchInput;
        }
        return [];
    };

    const finalizeCheckout = async (cartId: string, transactionId: string) => {
        const response = await fetch(`${MEDUSA_SERVER_URL}/custom/checkout`, {
            method: 'POST',
            body: JSON.stringify({
                cart_id: cartId,
                transaction_id: transactionId,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
    };

    const completeCheckout = async (cartId: string) => {
        const data = await retrieveCheckoutData(cartId);
        const transactionId = await doWalletPayment(data);
        if (transactionId?.length) {
            //final step in process
            await finalizeCheckout(cartId, transactionId);
        }
    };

    const handlePayment = async () => {
        try {
            //here connect wallet and sign in, if not connected
            connect();

            setSubmitting(true);

            updateCart.mutate(
                { context: {} },
                {
                    onSuccess: ({}) => {
                        console.log('updated cart successfully');
                        completeCart.mutate(void 0, {
                            onSuccess: ({ data, type }) => {
                                console.log('completed cart successfully');
                                try {
                                    completeCheckout(cart.id).then((r) => {
                                        setSubmitting(false);
                                        const countryCode =
                                            cart.shipping_address?.country_code?.toLowerCase();
                                        //Todo Add redirection after the payment is captured in order service
                                        // router.push(
                                        //     `/${countryCode}/order/confirmed/${cart.id}`
                                        // );
                                    });
                                } catch (e) {
                                    console.error(e);
                                }
                            },
                        });
                    },
                }
            );

            return;
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
