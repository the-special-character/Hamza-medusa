import { CartService as MedusaCartService } from '@medusajs/medusa';
import OrderRepository from '@medusajs/medusa/dist/repositories/order';
import PaymentRepository from '@medusajs/medusa/dist/repositories/payment';
import { LineItem } from '../models/line-item';
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
        if (lineItems) {
            if (Array.isArray(lineItems)) {
                for (let n = 0; n < lineItems.length; n++) {
                    lineItems[n].currency_code = 'eth';
                }
            } else {
                lineItems.currency_code = 'eth';
            }
        }
        console.log('ADDING LINE ITEM', lineItems);
        await super.addOrUpdateLineItems(cartId, lineItems, config);
    }
}
