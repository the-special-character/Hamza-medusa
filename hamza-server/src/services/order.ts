import {
    Cart,
    FulfillmentStatus,
    OrderService as MedusaOrderService,
    OrderStatus,
    PaymentStatus,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { Lifetime } from 'awilix';
import { In } from 'typeorm';

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;
    protected paymentRepository_: typeof PaymentRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.paymentRepository_ = container.paymentRepository;
    }

    async createFromPayment(
        cart: Cart,
        payment: Payment,
        storeId: string
    ): Promise<Order> {
        console.log(`creating Order with input ${JSON.stringify(payment)}`);
        try {
            //create the order
            let order: Order = new Order();
            order.billing_address_id = cart.billing_address_id;
            order.cart_id = cart.id;
            order.created_at = payment.created_at;
            order.currency_code = payment.currency_code;
            order.customer_id = cart.customer_id;
            order.discount_total = 0; //TODO: get proper discount
            order.store_id = storeId;
            order.email = cart.email;
            order.payment_status = PaymentStatus.AWAITING;
            order.shipping_address_id = cart.shipping_address_id;
            order.paid_total = payment.amount;
            order.region_id = cart.region_id;
            order.sales_channel_id = cart.sales_channel_id;
            order.total = payment.amount;
            order.updated_at = payment.updated_at;

            //save the order
            order = await this.orderRepository_.save(order);

            //update the cart
            cart.completed_at = new Date();
            await this.cartService_.update(cart.id, cart);

            return order;
        } catch (e) {
            console.log(`Error creating order: ${e}`);
        }
    }

    async getOrdersForCart(cartId: string): Promise<Order[]> {
        return await this.orderRepository_.find({
            where: { cart_id: cartId, status: OrderStatus.PENDING },
            relations: ['store.owner', 'payments'],
        });
    }

    async updateOrderAfterTransaction(orderId: string, update: Partial<Order>): Promise<Order> {
        console.log('Received update for order:', orderId, update);
        const result = await this.orderRepository_.save({ id: orderId, ...update });
        console.log('Update result:', result);
        return result;
    }

    async updatePaymentAfterTransaction(paymentId: string, update: Partial<Payment>): Promise<Payment> {
        console.log('Received update for payment:', paymentId, update);
        const result = await this.paymentRepository_.save({ id: paymentId, ...update });
        console.log('Update result:', result);
        return result;
    }

    async setCartId (payment: Payment, update: Partial<Payment>): Promise<Payment> {
        console.log(`payment: ${payment}`);
        const result = await this.paymentRepository_.save({id: payment.id, ...update})
        return result
    }

    async finalizeCheckout(
        cart_id: string,
        transaction_id: string,
        payer_address,
        receiver_address,
        escrow_contract_address
    ): Promise<Order[]> {
        //get orders
        const orders: Order[] = await this.orderRepository_.find({
            where: {cart_id},
        });
        //get payments
        const orderIds = orders.map((order) => order.id);
        // TODO: Payments are not setting cart_id, so they must be found by order_id instead
        const payments: Payment[] = await this.paymentRepository_.find({
            where: { order_id: In(orderIds) },
        });


        const promises: Promise<Order | Payment>[] = [];

        //update orders with transaction info
        orders.forEach((o, i) => {
            promises.push(this.updateOrderAfterTransaction(o.id, { transaction_id }));
        });

        //update payments with transaction info
        payments.forEach((p, i) => {
            promises.push(this.updatePaymentAfterTransaction(p.id, {
                transaction_id, // Remove from here and from model
                receiver_address,
                payer_address,
                escrow_contract_address,
            }));
        });

        try{
            await Promise.all(promises);
        } catch(e){
            console.log(`Error updating orders/payments: ${e}`);
        }

        return orders;
    }
}
