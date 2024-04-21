import {
    Cart,
    FulfillmentStatus,
    Order,
    OrderService as MedusaOrderService,
    Payment,
    PaymentStatus,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { Lifetime } from 'awilix';

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;
    protected paymentService_: typeof PaymentService;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.paymentService_ = container.paymentService;
    }

    async createFromPayment(cart: Cart, payment: Payment): Promise<Order> {
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
            order.display_id;
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
}
