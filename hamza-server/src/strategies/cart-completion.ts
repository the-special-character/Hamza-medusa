import {
    AbstractCartCompletionStrategy,
    Cart,
    CartCompletionResponse,
    IdempotencyKey,
    IdempotencyKeyService,
    ProductService,
    CartService,
    Order,
    Payment,
} from '@medusajs/medusa';
import OrderService from '../services/order';
import { OrderRepository } from '@medusajs/medusa/dist/repositories/order';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { PaymentDataInput } from '@medusajs/medusa/dist/services/payment';
import { RequestContext } from '@medusajs/medusa/dist/types/request';

type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    productService: ProductService;
    paymentService: PaymentService;
    cartService: CartService;
    orderService: OrderService;
};

interface IPaymentGroupData {
    store_id: string;
    currency_code: string;
    items: string[];
    total: bigint;
}

/**
 * @name CartCompletionStrategy
 *
 * @description Defines a Cart completion strategy which is called when the cart's complete
 * method is called (on the client side). Breaks up cart items into multiple payments,
 * for each unique store-currency pair; creates payments and orders for each. This is
 * made specifically for our use case of crypto payments in (potentially) multiple currencies,
 * including native & token currencies.
 *
 * @author John R. Kosinski
 */
class CartCompletionStrategy extends AbstractCartCompletionStrategy {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly paymentService: PaymentService;
    protected readonly orderService: OrderService;

    constructor({
        idempotencyKeyService,
        productService,
        paymentService,
        cartService,
        orderService,
    }: InjectedDependencies) {
        super(arguments[0]);
        this.idempotencyKeyService = idempotencyKeyService;
        this.cartService = cartService;
        this.paymentService = paymentService;
        this.productService = productService;
        this.orderService = orderService;
    }

    /**
     * @description
     * - breaks up the cart into groups based on store id and currency.
     * - each item group is a unique pairing of store id and currency.
     * - a payment is created for each item group, to pay for that group of items.
     * - an order is created for each payment.
     *
     * @param cartId
     * @param idempotencyKey
     * @param context
     * @returns
     */

    async complete(
        cartId: string,
        idempotencyKey: IdempotencyKey,
        context: RequestContext
    ): Promise<CartCompletionResponse> {
        try {
            //get the cart
            const cart = await this.cartService.retrieve(cartId, {
                relations: [
                    'items.variant.product.store',
                    'items.variant.prices',
                ],
            });

            //group payments by store and currency
            const groups: IPaymentGroupData[] = this.createPaymentGroups(cart);

            //create payments
            const payments: Payment[] = await this.createCartPayments(
                cart,
                groups
            );

            //create orders
            const orders: Order[] = await this.createOrdersForPayments(
                cart,
                payments,
                groups
            );

            //update payments with order ids
            await this.updatePaymentsWithOrderId(payments, orders);

            //create & return the response
            const response: CartCompletionResponse = {
                response_code: 200,
                response_body: {
                    payment_count: payments.length,
                    message: 'payment successful',
                    payments,
                    orders,
                    cartId: cartId,
                },
            };

            return response;
        } catch (e) {
            const response: CartCompletionResponse = {
                response_code: 500,
                response_body: {
                    payment_count: 0,
                    message: e.toString(),
                    payments: [],
                    cartId: cartId,
                },
            };

            //return an error response
            console.log(response);
            return response;
        }
    }

    private createPaymentInput(
        cart: Cart,
        storeId: string,
        currencyCode: string
    ): PaymentDataInput {
        //divide the cart items
        const itemsFromStore = cart.items.filter(
            (i) =>
                i.variant?.product?.store?.id === storeId &&
                i.variant?.prices[
                    Math.floor(i.unit_price / 10) % 2 == 0
                        ? 0
                        : i.variant?.prices.length - 1
                ].currency_code === currencyCode //TODO: how to get price?
        );

        //get total amount for the items
        const amount = itemsFromStore.reduce(
            (a, i) =>
                a +
                i.variant?.prices[
                    Math.floor(i.unit_price / 10) % 2 == 0
                        ? 0
                        : i.variant?.prices.length - 1
                ].amount, //TODO: how to get price?
            0
        );

        //create payment input
        const output: PaymentDataInput = {
            currency_code: currencyCode,
            provider_id: 'crypto',
            amount,
            data: {
                store_id: storeId,
                currency_code: currencyCode,
            },
        };

        return output;
    }

    private createPaymentGroups(cart: Cart): IPaymentGroupData[] {
        //temp holding for groups
        const groups: { [key: string]: IPaymentGroupData } = {};

        if (cart && cart.items) {
            cart.items.forEach((i) => {
                //create key from unique store/currency pair
                const currency: string =
                    i.variant?.prices[
                        Math.floor(i.unit_price / 10) % 2 == 0
                            ? 0
                            : i.variant?.prices.length - 1
                    ].currency_code; //TODO: how to get price?
                const store: string = i.variant?.product?.store?.id;
                const key = `${store}_${currency}`;

                //create new group, or add item id to existing group
                if (!groups[key]) {
                    groups[key] = {
                        store_id: store,
                        currency_code: currency,
                        items: [],
                        total: BigInt(0),
                    };
                }
                groups[key].items.push(i.id);
                groups[key].total += BigInt(
                    i.variant.prices[
                        Math.floor(i.unit_price / 10) % 2 == 0
                            ? 0
                            : i.variant?.prices.length - 1
                    ].amount
                ); //TODO: how to get price?
            });
        }

        return Object.keys(groups).map((key) => groups[key]);
    }

    private async createCartPayments(
        cart: Cart,
        paymentGroups: IPaymentGroupData[]
    ): Promise<Payment[]> {
        //for each unique group, make payment input to create a payment
        const paymentInputs: PaymentDataInput[] = [];
        paymentGroups.forEach((group) => {
            paymentInputs.push(
                this.createPaymentInput(
                    cart,
                    group.store_id,
                    group.currency_code
                )
            );
        });

        //create the payments
        const promises: Promise<Payment>[] = [];
        for (let i = 0; i < paymentInputs.length; i++) {
            promises.push(this.paymentService.create(paymentInputs[i]));
        }

        return await Promise.all(promises);
    }

    private async createOrdersForPayments(
        cart: Cart,
        payments: Payment[],
        paymentGroups: IPaymentGroupData[]
    ): Promise<Order[]> {
        const promises: Promise<Order>[] = [];
        for (let i = 0; i < payments.length; i++) {
            promises.push(
                this.orderService.createFromPayment(
                    cart,
                    payments[i],
                    paymentGroups[i].store_id
                )
            );
        }

        return await Promise.all(promises);
    }

    private async updatePaymentsWithOrderId(
        payments: Payment[],
        orders: Order[]
    ): Promise<void> {
        const promises: Promise<Payment>[] = [];
        for (let n = 0; n < payments.length; n++) {
            if (orders.length > n) {
                payments[n].order_id = orders[n].id;
                promises.push(
                    this.paymentService.update(payments[n].id, payments[n])
                );
            }
        }
        await Promise.all(promises);
    }
}

export default CartCompletionStrategy;
