import { 
    AbstractPaymentProcessor, 
    PaymentProcessorContext, 
    PaymentProcessorError, 
    PaymentProcessorSessionResponse, 
    PaymentSessionStatus 
} from "@medusajs/medusa";

/**
 * @description This is being used as a test right now for payment processing using 
 * crypto wallets; if used it will be changed alot. Right now only a test.
 * @author John R. Kosinski
 */
class CryptoPaymentService extends AbstractPaymentProcessor {
    static identifier = "crypto-payment-provider";
    
    constructor(container) {
        super(container);
    }
    
    async capturePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        console.log("CryptoPaymentService: capturePayment");
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
    
    async initiatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
        console.log("CryptoPaymentService: initiatePayment");
        return {
            session_data: {
                "method": "initiatePayment",
                "song": "rondo alla turca", 
                "craic": 90
            }
        };
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
        return {
            session_data: {
                "method": "updatePayment",
                "time": "leisure time"
            }
        };
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