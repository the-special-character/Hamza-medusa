'use client';

import { Cart, PaymentSession } from '@medusajs/medusa';
import { Button } from '@medusajs/ui';
import { OnApproveActions, OnApproveData } from '@paypal/paypal-js';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useElements, useStripe } from '@stripe/react-stripe-js';
import { placeOrder } from '@modules/checkout/actions';
import React, { useState, useEffect } from 'react';
import ErrorMessage from '../error-message';
import Spinner from '@modules/common/icons/spinner';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { ITransactionOutput, SwitchClient } from 'web3/switch-client';
import { ethers } from 'ethers';
import { MasterSwitchClient } from 'web3/master-switch-client';

type PaymentButtonProps = {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

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
            return (
                <ManualTestPaymentButton
                    notReady={notReady}
                    transaction_id={''}
                />
            );
        case 'crypto':
            return <CryptoPaymentButton notReady={notReady} cart={cart} />;
        default:
            return (
                <ManualTestPaymentButton
                    notReady={notReady}
                    transaction_id={''}
                />
            );
        //return <Button disabled>Select a payment method</Button>
    }
};

const ManualTestPaymentButton = ({
    notReady,
    transaction_id,
}: {
    notReady: boolean;
    transaction_id: string;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onPaymentCompleted = async () => {
        await placeOrder('').catch((err) => {
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

// Extend the Window interface
declare global {
    interface Window {
        ethereum: ethers.Eip1193Provider;
    }
}

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

    const { openConnectModal } = useConnectModal();
    const { connector: activeConnector, isConnected } = useAccount();
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

            /*
            const switchClient: SwitchClient = new SwitchClient(
                provider,
                signer,
                '0xA5ffa0a980127493Fe770BE6fC5f6BB395321312'
            ); //TODO: get contract address dynamically
            const output: ITransactionOutput =
                await switchClient.placeSinglePayment({
                    currency: 'usdc',
                    amount: session.amount,
                    id: Math.floor(Math.random() * 9999) + 1,
                    payer: signer.address ?? '',
                    receiver: receiver,
                });
            */
           
            const switchClient: MasterSwitchClient = new MasterSwitchClient(
                provider,
                signer,
                '0xba00189f9c9824984D9D4ACC6eff365Ed63c1Fd9' //TODO: get contract address dynamically
            );
            
            const output: ITransactionOutput =
                await switchClient.placeMultiplePayments([{
                    receiver: receiver,
                    currency: 'usdc',
                    payments: [{
                        id: Math.floor(Math.random() * 9999) + 1, //TODO: use real order id
                        payer: signer.address ?? '',
                        receiver: receiver,
                        amount: session.amount,
                    }]
                }]);

            console.log(output);
            console.log('TX ID: ', output.transaction_id);
            return output.transaction_id;
        } catch (e) {
            console.error(e);
        }

        return '';
    };

    const onPaymentCompleted = async (transactionId: string) => {
        await placeOrder(transactionId).catch(() => {
            setErrorMessage('An error occurred, please try again.');
            setSubmitting(false);
        });
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
