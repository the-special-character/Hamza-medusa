import { 
    AbstractPaymentProcessor,
    PaymentProcessorContext,
    PaymentProcessorError,
    PaymentProcessorSessionResponse,
    PaymentSessionStatus
} from '@medusajs/medusa';
import { PaymentIntentOptions } from 'medusa-payment-stripe'; //TODO: need? 
import { ethers, TransactionResponse } from 'ethers';

async function verifyPaymentTransactionId(transaction_id: any) : Promise<boolean> {
    try {
        const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.org');
        const tx: TransactionResponse = await provider.getTransaction(transaction_id); 
        if (tx) {
            //tx.from
            return true;
        }
    }
    catch(e) {
        console.error(e);
    }
    return false;
}

/**
 * @description This is being used as a test right now for payment processing using 
 * crypto wallets; if used it will be changed alot. Right now only a test.
 * @author John R. Kosinski
 */
class CryptoPaymentService extends AbstractPaymentProcessor {
    static identifier = 'crypto';

    constructor(container, config) {
        console.log('CryptoPaymentService::container');
        console.log(container);
        console.log('CryptoPaymentService::config');
        console.log(config);
        super(container, config);
    }

    async capturePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
        console.log('CryptoPaymentService: capturePayment');
        console.log(paymentSessionData);
        console.log(super.container);
        return {
            session_data: paymentSessionData
        };
    }

    async authorizePayment(paymentSessionData: Record<string, unknown>, context: Record<string, unknown>): Promise<PaymentProcessorError | {
        status: PaymentSessionStatus;
        data: PaymentProcessorSessionResponse['session_data'];
    }> {
        console.log('CryptoPaymentService: authorizePayment');
        console.log(paymentSessionData);
        let payment_status = paymentSessionData.payment_status;
        if (!payment_status) 
            payment_status = 'ok';
        
        return {
            status: payment_status == 'ok' ? PaymentSessionStatus.AUTHORIZED : PaymentSessionStatus.ERROR,
            data: {
                session_data: paymentSessionData
            }
        }
    }

    async cancelPayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']>
    {
        console.log('CryptoPaymentService: cancelPayment');
        return {
            session_data: paymentSessionData
        };
    }

    getPaymentIntentOptions(): PaymentIntentOptions {
        const options: PaymentIntentOptions = {};

        options.capture_method = 'manual';
            
        options.payment_method_types = [
            'crypto',
            'payment',
            'manual'
        ]
        return options;
    }

    async initiatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse> {
        console.log('CryptoPaymentService: initiatePayment');
        console.log(context);

        const intentRequestData = this.getPaymentIntentOptions();
        const { email, currency_code, amount, resource_id, customer } = context;
        
        //if there is a tx id, verify that it's legit
        let payment_status = 'ok'; 
        if (context?.context?.transaction_id) {
            const transaction_id = context.context.transaction_id;
            console.log('got transaction_id: ', transaction_id);
            if (!await verifyPaymentTransactionId(transaction_id)) {
                payment_status = 'failed';
            }
        }

        const session_data: any = {
            amount: Math.round(100),
            currency: 'USD',
            notes: { resource_id },
            payment: {
                capture: 'manual',
                payment_status: payment_status,
                capture_options: {
                    refund_speed: 'normal',
                    automatic_expiry_period: 5,
                    manual_expiry_period: 10,
                },
            },
            ...intentRequestData,
        };
        return {
            session_data: session_data as any
        };
    }

    async deletePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
        console.log('CryptoPaymentService: deletePayment');
        console.log(paymentSessionData);
        return {
            session_data: paymentSessionData
        };
    }

    async getPaymentStatus(paymentSessionData: Record<string, unknown>): Promise<PaymentSessionStatus> {
        console.log('CryptoPaymentService: getPaymentStatus');
        console.log(paymentSessionData); 
        
        try {
            const payment_status = paymentSessionData.session_data['session_data']?.payment?.payment_status ?? '';
            console.log(payment_status);
            return payment_status === 'failed' ? PaymentSessionStatus.ERROR : PaymentSessionStatus.AUTHORIZED;
        }
        catch(e) {
            console.error(e);
        }
        
        return PaymentSessionStatus.AUTHORIZED;
    }

    async refundPayment(paymentSessionData: Record<string, unknown>, refundAmount: number): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
        console.log('CryptoPaymentService: refundPayment');
        console.log(paymentSessionData);
        return {
            session_data: paymentSessionData
        };
    }

    async retrievePayment(paymentSessionData: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
        console.log('CryptoPaymentService: retrievePayment');
        console.log(paymentSessionData);
        return {
            session_data: paymentSessionData
        };
    }

    async updatePayment(context: PaymentProcessorContext): Promise<PaymentProcessorError | PaymentProcessorSessionResponse | void> {
        console.log('CryptoPaymentService: updatePayment');
        console.log(context);
        return this.initiatePayment(context);
    }

    async updatePaymentData(sessionId: string, data: Record<string, unknown>): Promise<PaymentProcessorError | PaymentProcessorSessionResponse['session_data']> {
        console.log('CryptoPaymentService: updatePaymentData');
        return {
            session_data: {
                'method': 'updatePaymentData',
                'actor': 'stephen chow',
                'sessionId': sessionId
            }
        };
    }
}

export default CryptoPaymentService