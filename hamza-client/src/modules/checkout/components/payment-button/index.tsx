"use client"

import { Cart, PaymentSession } from "@medusajs/medusa"
import { Button } from "@medusajs/ui"
import { OnApproveActions, OnApproveData } from "@paypal/paypal-js"
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { placeOrder } from "@modules/checkout/actions"
import React, { useState } from "react"
import ErrorMessage from "../error-message"
import Spinner from "@modules/common/icons/spinner"
import { MedusaProvider } from "medusa-react"
import { RainbowWrapper } from "app/rainbow-provider"
import { ChakraProvider } from "@chakra-ui/react"
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

type PaymentButtonProps = {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ cart }) => {
    const notReady =
        !cart ||
            !cart.shipping_address ||
            !cart.billing_address ||
            !cart.email ||
            cart.shipping_methods.length < 1
            ? true
            : false

    const paymentSession = cart.payment_session as PaymentSession

    switch (paymentSession.provider_id) {
        case "stripe":
            return <StripePaymentButton notReady={notReady} cart={cart} />
        case "manual":
            return <ManualTestPaymentButton notReady={notReady} />
        case "paypal":
            return <PayPalPaymentButton notReady={notReady} cart={cart} />
        case "crypto":
            return <CryptoPaymentButton notReady={notReady} cart={cart} />
        default:
            return <ManualTestPaymentButton notReady={notReady} />
        //return <Button disabled>Select a payment method</Button>
    }
}

const StripePaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
    notReady: boolean
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onPaymentCompleted = async () => {
        await placeOrder().catch(() => {
            setErrorMessage("An error occurred, please try again.")
            setSubmitting(false)
        })
    }

    const stripe = useStripe()
    const elements = useElements()
    const card = elements?.getElement("card")

    const session = cart.payment_session as PaymentSession

    const disabled = !stripe || !elements ? true : false

    const handlePayment = async () => {
        setSubmitting(true)

        if (!stripe || !elements || !card || !cart) {
            setSubmitting(false)
            return
        }

        await stripe
            .confirmCardPayment(session.data.client_secret as string, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name:
                            cart.billing_address.first_name +
                            " " +
                            cart.billing_address.last_name,
                        address: {
                            city: cart.billing_address.city ?? undefined,
                            country: cart.billing_address.country_code ?? undefined,
                            line1: cart.billing_address.address_1 ?? undefined,
                            line2: cart.billing_address.address_2 ?? undefined,
                            postal_code: cart.billing_address.postal_code ?? undefined,
                            state: cart.billing_address.province ?? undefined,
                        },
                        email: cart.email,
                        phone: cart.billing_address.phone ?? undefined,
                    },
                },
            })
            .then(({ error, paymentIntent }) => {
                if (error) {
                    const pi = error.payment_intent

                    if (
                        (pi && pi.status === "requires_capture") ||
                        (pi && pi.status === "succeeded")
                    ) {
                        onPaymentCompleted()
                    }

                    setErrorMessage(error.message || null)
                    return
                }

                if (
                    (paymentIntent && paymentIntent.status === "requires_capture") ||
                    paymentIntent.status === "succeeded"
                ) {
                    return onPaymentCompleted()
                }

                return
            })
    }

    return (
        <>
            <Button
                disabled={disabled || notReady}
                onClick={handlePayment}
                size="large"
                isLoading={submitting}
            >
                Place order
            </Button>
            <ErrorMessage error={errorMessage} />
        </>
    )
}

const PayPalPaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
    notReady: boolean
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onPaymentCompleted = async () => {
        await placeOrder().catch(() => {
            setErrorMessage("An error occurred, please try again.")
            setSubmitting(false)
        })
    }

    const session = cart.payment_session as PaymentSession

    const handlePayment = async (
        _data: OnApproveData,
        actions: OnApproveActions
    ) => {
        actions?.order
            ?.authorize()
            .then((authorization) => {
                if (authorization.status !== "COMPLETED") {
                    setErrorMessage(`An error occurred, status: ${authorization.status}`)
                    return
                }
                onPaymentCompleted()
            })
            .catch(() => {
                setErrorMessage(`An unknown error occurred, please try again.`)
                setSubmitting(false)
            })
    }

    const [{ isPending, isResolved }] = usePayPalScriptReducer()

    if (isPending) {
        return <Spinner />
    }

    if (isResolved) {
        return (
            <>
                <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={async () => session.data.id as string}
                    onApprove={handlePayment}
                    disabled={notReady || submitting || isPending}
                />
                <ErrorMessage error={errorMessage} />
            </>
        )
    }
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onPaymentCompleted = async () => {
        await placeOrder().catch((err) => {
            setErrorMessage(err.toString())
            setSubmitting(false)
        })
    }

    const handlePayment = () => {
        setSubmitting(true)

        onPaymentCompleted()
    }

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
    )
}

const CryptoPaymentButton = ({
    cart,
    notReady,
}: {
    cart: Omit<Cart, "refundable_amount" | "refunded_total">
    notReady: boolean
}) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const onPaymentCompleted = async () => {
        await placeOrder().catch(() => {
            setErrorMessage("An error occurred, please try again.");
            setSubmitting(false);
        })
    }

    const session = cart.payment_session as PaymentSession;

    const handlePayment = async () => {
        setSubmitting(true);

        console.log(window.ethereum);
        await connect();
        console.log(window.ethereum);

        onPaymentCompleted();   
    }

    return (
        <>
            <div>
                    <RainbowWrapper>
                        <ChakraProvider>
                        <main className="relative">
                            <Button fontWeight="italic"
                                bg="transparent"
                                size="large"
                                isLoading={submitting}
                                disabled={notReady}
                                color="white"
                                onClick={handlePayment}
                                border="2px" // Sets the border width
                                >Place Order: Crypto
                            </Button>
                        </main>
                        </ChakraProvider>
                    </RainbowWrapper>
            </div>
            <ErrorMessage error={errorMessage} />
        </>
    )
}

export default PaymentButton
