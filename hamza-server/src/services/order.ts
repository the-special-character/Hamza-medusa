import {
    Cart,
    FulfillmentStatus,
    OrderService as MedusaOrderService,
    OrderStatus,
    Payment,
    PaymentStatus,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { Order } from '../models/order';
import { Lifetime } from 'awilix';
import { UpdateResult } from 'typeorm';

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;
    protected paymentRepository_: typeof PaymentRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
    }

    async createFromPayment(
        cart: Cart,
        payment: Payment,
        storeId: string
    ): Promise<Order> {
        console.log(
            'OrderService.createFromPayment() method running with input;',
            payment
        );

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
            console.log(`Error creating customer: ${e}`);
        }
    }

    async getOrdersForCart(cartId: string): Promise<Order[]> {
        return await this.orderRepository_.find({
            where: { cart_id: cartId },
            relations: ['store.owner', 'payments'],
        });
    }

    async finalizeOrdersAndPayments(
        cartId: string,
        transactionId: string
    ): Promise<Order[]> {
        const orders: Order[] = await this.orderRepository_.find({
            where: { cart_id: cartId },
        });
        const promises: Promise<UpdateResult>[] = [];

        orders.forEach((o, i) => {
            orders[i].transaction_id = transactionId;
            promises.push(
                this.orderRepository_.update(o.id, {
                    payment_status: PaymentStatus.AWAITING,
                    status: OrderStatus.COMPLETED,
                    //transaction_id: transactionId
                })
            );
        });

        await Promise.all(promises);

        return orders;
    }
}
