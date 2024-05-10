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
import { ethers, BigNumberish } from 'ethers';
import { useCompleteCart, useUpdateCart } from 'medusa-react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { clearCart } from '@lib/data';
import { getCurrencyPrecision } from 'currency.config';

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

    // useEffect hook to check if connection status changes
    // if !isConnected, connect to wallet
    useEffect(() => {
        if (!isConnected) {
            if (openConnectModal) openConnectModal();
        }
    }, [openConnectModal, isConnected]);

    //return transaction id
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
                '0x0Ac64d6d09bB3B7ab6999f9BE3b9f017220fb1e9' //TODO: get contract address dynamically
            );

            //create the inputs
            const switchInput: IMultiPaymentInput[] = await createSwitchInput(
                data,
                await signer.getAddress()
            );

            console.log(switchInput);
            const output: ITransactionOutput =
                await switchClient.placeMultiplePayments(switchInput);

            console.log(output);
            return {
                transaction_id: output.transaction_id,
                payer_address: output.receipt.from,
                escrow_contract_address: output.receipt.to,
            };
        } catch (e) {
            console.error('error has occured during transaction', e);
        }

        return {};
    };

    const retrieveCheckoutData = async (cart_id: string) => {
        const response = await axios.get(
            `${MEDUSA_SERVER_URL}/custom/checkout?cart_id=${cart_id}`
        );
        return response.status == 200 && response.data ? response.data : {};
    };

    const translateToNativeAmount = (order: any) => {
        const { amount, currency_code } = order;
        const precision = getCurrencyPrecision(11155111, currency_code);
        const adjustmentFactor = Math.pow(10, precision.native - precision.db);
        const nativeAmount = BigInt(amount) * BigInt(adjustmentFactor);
        return ethers.toBigInt(nativeAmount);
    };

    const createSwitchInput = async (data: any, payer: string) => {
        //TODO: typeSafety of the data
        if (data.orders) {
            const switchInput: IMultiPaymentInput[] = [];
            data.orders.forEach((o: any) => {
                console.log(o)
                o.amount = translateToNativeAmount(o);
                console.log(o)
                const input: IMultiPaymentInput = {
                    currency: o.currency_code,
                    receiver: o.wallet_address,
                    payments: [
                        {
                            id: ethers.toBigInt(
                                ethers.keccak256(ethers.toUtf8Bytes(o.order_id))
                            ),
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

    const useFinalizeCheckout = useMutation(
        (data: {
            cart_id: string;
            transaction_id: string;
            payer_address: string;
            escrow_contract_address: string;
        }) =>
            axios.post(`${MEDUSA_SERVER_URL}/custom/checkout`, {
                cart_id: data.cart_id,
                transaction_id: data.transaction_id,
                payer_address: data.payer_address,
                escrow_contract_address: data.escrow_contract_address,
            }),
        {
            onSuccess: (data) => {
                return true;
            },
            onError: (error) => {
                return false;
            },
        }
    );

    const completeCheckout = async (cart_id: string) => {
        const data = await retrieveCheckoutData(cart_id);
        const { transaction_id, payer_address, escrow_contract_address } =
            await doWalletPayment(data);

        if (transaction_id?.length) {
            //final step in process
            const { mutate: finalizeCheckout } = useFinalizeCheckout;
            finalizeCheckout({
                cart_id,
                transaction_id,
                payer_address,
                escrow_contract_address,
            });
        }

        return data?.orders?.length ? data.orders[0].order_id : '';
    };

    const handlePayment = async () => {
        try {
            //here connect wallet and sign in, if not connected
            connect();

            setSubmitting(true);

            updateCart.mutate(
                { context: {} },
                {
                    onSuccess: ({ }) => {
                        completeCart.mutate(void 0, {
                            onSuccess: ({ data, type }) => {
                                //TODO: data is undefined
                                try {
                                    completeCheckout(cart.id).then(
                                        (order_id) => {
                                            //clear cart
                                            clearCart();

                                            //redirect to confirmation page
                                            const countryCode =
                                                cart.shipping_address?.country_code?.toLowerCase();

                                            router.push(
                                                `/${countryCode}/order/confirmed/${order_id}`
                                            );
                                        }
                                    );
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
