import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import OrderService from '../../../services/order';

interface ICheckoutData {
    order_id: string;
    wallet_address: string;
    currency_code: string;
    amount: number;
}

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const { cart_id } = req.query;

    try {
        const orders = await orderService.getOrdersForCart(cart_id.toString());
        const output: ICheckoutData[] = [];
        orders.forEach((o) => {
            output.push({
                order_id: o.id,
                wallet_address: o.store?.owner?.wallet_address ?? '',
                currency_code: o.payments[0].currency_code,
                amount: o.payments[0].amount,
            });
        });
        console.log(output);
        res.send({ orders: output });
    } catch (e) {
        console.error(e);
        res.send({ message: e.message });
    }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const orderService: OrderService = req.scope.resolve('orderService');
    const { cart_id, transaction_id } = req.body;

    try {
        await orderService.finalizeCheckout(cart_id.toString(), transaction_id);
        res.send(true);
    } catch (e) {
        console.error(e);
        res.send({ message: e.message });
    }
};
