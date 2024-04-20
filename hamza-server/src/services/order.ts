import {
    Cart,
    Order,
    OrderService as MedusaOrderService,
    Payment,
} from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import { Lifetime } from 'awilix';

export default class OrderService extends MedusaOrderService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
    }

    async createFromPayment(cartId: string, input: Payment): Promise<Order> {
        console.log(
            'OrderService.createFromPayment() method running with input;',
            input
        );

        console.log(`creating Order with input ${JSON.stringify(input)}`);
        try {
            const order: Order = await super.createFromCart(cartId);
            return order;
        } catch (e) {
            console.log(`Error creating customer: ${e}`);
        }
    }
}
