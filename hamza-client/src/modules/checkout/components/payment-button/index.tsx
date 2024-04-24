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
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';

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
    console.log('paymentSession: ', paymentSession);

    switch (paymentSession.provider_id) {
        case 'stripe':
            return <StripePaymentButton notReady={notReady} cart={cart} />;
        case 'manual':
            return <ManualTestPaymentButton notReady={notReady} />;
        //case 'paypal':
        //    return <PayPalPaymentButton notReady={notReady} cart={cart} />
        case 'crypto':
            return <CryptoPaymentButton notReady={notReady} cart={cart} />;
        default:
            return <ManualTestPaymentButton notReady={notReady} />;
        //return <Button disabled>Select a payment method</Button>
    }
};

const StripePaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    notReady: boolean;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onPaymentCompleted = async () => {
        await placeOrder().catch(() => {
            setErrorMessage('An error occurred, please try again.');
            setSubmitting(false);
        });
    };

    const stripe = useStripe();

    const elements = useElements();
    const card = elements?.getElement('card');

    const session = cart.payment_session as PaymentSession;

    const disabled = !stripe || !elements ? true : false;

    const wrappedClickClosure = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
        handlePayment();
    };

    const handlePayment = async () => {
        setSubmitting(true);

        if (!stripe || !elements || !card || !cart) {
            setSubmitting(false);
            return;
        }

        await stripe
            .confirmCardPayment(session.data.client_secret as string, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name:
                            cart.billing_address.first_name +
                            ' ' +
                            cart.billing_address.last_name,
                        address: {
                            city: cart.billing_address.city ?? undefined,
                            country:
                                cart.billing_address.country_code ?? undefined,
                            line1: cart.billing_address.address_1 ?? undefined,
                            line2: cart.billing_address.address_2 ?? undefined,
                            postal_code:
                                cart.billing_address.postal_code ?? undefined,
                            state: cart.billing_address.province ?? undefined,
                        },
                        email: cart.email,
                        phone: cart.billing_address.phone ?? undefined,
                    },
                },
            })
            .then(({ error, paymentIntent }) => {
                if (error) {
                    const pi = error.payment_intent;

                    if (
                        (pi && pi.status === 'requires_capture') ||
                        (pi && pi.status === 'succeeded')
                    ) {
                        onPaymentCompleted();
                    }

                    setErrorMessage(error.message || null);
                    return;
                }

                if (
                    (paymentIntent &&
                        paymentIntent.status === 'requires_capture') ||
                    paymentIntent.status === 'succeeded'
                ) {
                    return onPaymentCompleted();
                }

                return;
            });
    };

    return (
        <>
            <Button
                disabled={disabled || notReady}
                onClick={wrappedClickClosure}
                size="large"
                isLoading={submitting}
            >
                Place order
            </Button>
            <ErrorMessage error={errorMessage} />
        </>
    );
};

const PayPalPaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
    notReady: boolean;
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onPaymentCompleted = async () => {
        await placeOrder().catch(() => {
            setErrorMessage('An error occurred, please try again.');
            setSubmitting(false);
        });
    };

    const session = cart.payment_session as PaymentSession;

    const handlePayment = async (
        _data: OnApproveData,
        actions: OnApproveActions
    ) => {
        actions?.order
            ?.authorize()
            .then((authorization) => {
                if (authorization.status !== 'COMPLETED') {
                    setErrorMessage(
                        `An error occurred, status: ${authorization.status}`
                    );
                    return;
                }
                onPaymentCompleted();
            })
            .catch(() => {
                setErrorMessage(`An unknown error occurred, please try again.`);
                setSubmitting(false);
            });
    };

    const [{ isPending, isResolved }] = usePayPalScriptReducer();

    if (isPending) {
        return <Spinner />;
    }

    if (isResolved) {
        return (
            <>
                <PayPalButtons
                    style={{ layout: 'horizontal' }}
                    createOrder={async () => session.data.id as string}
                    onApprove={handlePayment}
                    disabled={notReady || submitting || isPending}
                />
                <ErrorMessage error={errorMessage} />
            </>
        );
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

            const switchClient: SwitchClient = new SwitchClient(
                provider,
                signer,
                '0xA5ffa0a980127493Fe770BE6fC5f6BB395321312'
            ); //TODO: get contract address dynamically
            const output: ITransactionOutput =
                await switchClient.placeSinglePayment({
                    amount: session.amount,
                    id: Math.floor(Math.random() * 9999) + 1,
                    payer: signer.address ?? '',
                    receiver: receiver,
                });

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
                            //Todo Add riderection after the payment is captured in order service
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
