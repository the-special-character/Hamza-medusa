import { CartService as MedusaCartService, LineItem } from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { Lifetime } from 'awilix';

export default class CartService extends MedusaCartService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected orderRepository_: typeof OrderRepository;
    protected paymentRepository_: typeof PaymentRepository;

    constructor(container) {
        super(container);
        this.orderRepository_ = container.orderRepository;
        this.paymentRepository_ = container.paymentRepository;
    }

    async addOrUpdateLineItems(
        cartId: string,
        lineItems: LineItem | LineItem[],
        config: { validateSalesChannels: boolean }
    ): Promise<void> {
        console.log('ADDING LINE ITEM', lineItems);
        super.addOrUpdateLineItems(cartId, lineItems, config);
    }
}
