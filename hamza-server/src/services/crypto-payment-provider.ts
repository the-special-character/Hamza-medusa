import { 
    AbstractPaymentProcessor, 
    PaymentProcessorContext, 
    PaymentProcessorError, 
    PaymentProcessorSessionResponse, 
    PaymentSessionStatus 
} from "@medusajs/medusa";

class CryptoPaymentService extends AbstractPaymentProcessor {
    async capturePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<PaymentProcessorError | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse["session_data"];
    }>{
        return {
            error: "not implemented",
            code: ""
        };
    }
    async cancelPayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]>
    {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async initiatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
        return PaymentSessionStatus.ERROR;
    }
    async refundPayment(paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async updatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
        return {
            error: "not implemented",
            code: ""
        };
    }
    async updatePaymentData(sessionId: string, data: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse["session_data"]> {
        return {
            error: "not implemented",
            code: ""
        };
    }
}

export default CryptoPaymentService