import { 
    AbstractPaymentProcessor, 
    PaymentProvider,
    PaymentProviderService,
    PaymentProcessorContext, 
    PaymentProcessorError, 
    PaymentProcessorSessionResponse, 
    PaymentSessionStatus 
} from "@medusajs/medusa";
import { PaymentIntentOptions } from "medusa-payment-stripe";

/**
 * @description This is being used as a test right now for payment processing using 
 * crypto wallets; if used it will be changed alot. Right now only a test.
 * @author John R. Kosinski
 */
class CryptoPaymentService extends AbstractPaymentProcessor {
    static identifier = "crypto";
    static title = "Pay Crypto";
    
    constructor(container, config) {
        console.log("CryptoPaymentService::container");
        console.log(container);
        console.log("CryptoPaymentService::config");
        console.log(config);
        super(container, config);
    }
    
    async capturePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: capturePayment");
        console.log(super.container);
        return {
            session_data: paymentSessionData
        };
    }
    
    async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<PaymentProcessorError | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse["session_data"];
    }> {
        console.log("CryptoPaymentService: authorizePayment");
        return {
            status: PaymentSessionStatus.AUTHORIZED,
            data: {
                session_data: paymentSessionData
            }
        }
    }
    
    async cancelPayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]>
    {
        console.log("CryptoPaymentService: cancelPayment");
        return {
            session_data: paymentSessionData
        };
    }

    getPaymentIntentOptions(): PaymentIntentOptions {
        const options: PaymentIntentOptions = {};

        options.capture_method = "manual";
            
        options.payment_method_types = [
            "crypto",
            "payment",
            "manual"
        ]
        return options;
    }
    
    async initiatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
        console.log("CryptoPaymentService: initiatePayment");

        const intentRequestData = this.getPaymentIntentOptions();
        const { email, currency_code, amount, resource_id, customer } = context;

        const session_data: any = {
            amount: Math.round(100),
            currency: "USD",
            notes: { resource_id },
            payment: {
                capture: "manual",
                capture_options: {
                    refund_speed: "normal",
                    automatic_expiry_period: 5,
                    manual_expiry_period: 10,
                },
            },
            ...intentRequestData,
        };
        return {
            session_data: session_data as any
        };
        /*
        return {
            session_data: {
                "method": "initiatePayment",
                "song": "rondo alla turca", 
                "craic": 90, 
                "payment_methods": [
                    "one",
                    "two"
                ]
            }
        };
        */
    }
    
    async deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: deletePayment");
        return {
            session_data: paymentSessionData
        };
    }
    
    async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
        console.log("CryptoPaymentService: getPaymentStatus");
        return PaymentSessionStatus.AUTHORIZED;
    }
    
    async refundPayment(paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: refundPayment");
        return {
            session_data: paymentSessionData
        };
    }
    
    async retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: retrievePayment"); 
        return {
            session_data: paymentSessionData
        };
    }
    
    async updatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
        console.log("CryptoPaymentService: updatePayment");
        return this.initiatePayment(context);
    }
    
    async updatePaymentData(sessionId: string, data: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: updatePaymentData");
        return {
            session_data: {
                "method": "updatePaymentData",
                "actor": "stephen chow",
                "sessionId": sessionId
            }
        };
    }
}

export default CryptoPaymentService