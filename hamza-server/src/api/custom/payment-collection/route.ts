import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import PaymentCollectionService from '../../../services/payment-collection';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const paymentCollectionService: PaymentCollectionService =
        req.scope.resolve('paymentCollectionService');
    const payload = req.body;

    try {
        const paymentCollection =
            await paymentCollectionService.create(payload);
        res.json(paymentCollection);
    } catch (err) {
        console.error('Error creating payment collection', err);
        res.status(500).json({
            error: 'Failed to create payment collection',
        });
    }
};
