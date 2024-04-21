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
                relations: ['items.variant.product.store.default_currency'],
            });

            //create payments
            const payments: Payment[] = await this._createCartPayments(cart);

            //create orders
            const orders: Order[] = await this._createOrdersForPayments(
                cart,
                payments
            );

            //create & return the response
            const response: CartCompletionResponse = {
                response_code: 200,
                response_body: {
                    payment_count: payments.length,
                    message: 'payment successful',
                    payments,
                },
            };

            console.log(response);
            return response;
        } catch (e) {
            const response: CartCompletionResponse = {
                response_code: 500,
                response_body: {
                    payment_count: 0,
                    message: e.toString(),
                    payments: [],
                },
            };

            //return an error response
            console.log(response);
            return response;
        }
    }

    private async _getStoreCurrencyData(cart: Cart): Promise<{
        store_currencies: { [key: string]: string };
        unique_store_ids: string[];
    }> {
        const storeCurrencies: { [key: string]: string } = {};
        const uniqueStoreIds: string[] = [];
        if (cart && cart.items) {
            cart.items.forEach((i) => {
                const storeId: string = i.variant?.product?.store?.id;
                storeCurrencies[storeId] =
                    i.variant?.product.store?.default_currency_code;
                if (uniqueStoreIds.findIndex((s) => s === storeId) < 0) {
                    uniqueStoreIds.push(storeId);
                }
            });
        }

        return {
            store_currencies: storeCurrencies,
            unique_store_ids: uniqueStoreIds,
        };
    }

    private _createPaymentInput(
        cart: Cart,
        storeId: string,
        currencyCode: string
    ): PaymentDataInput {
        //divide the cart items
        const itemsFromStore = cart.items.filter(
            (i) => i.variant?.product?.store?.id == storeId
        );

        //get total amount for the items
        const totalAmount = itemsFromStore.reduce(
            (a, c) => a + c.unit_price * c.quantity,
            0
        );

        //create payment input
        const output: PaymentDataInput = {
            currency_code: currencyCode,
            provider_id: 'crypto',
            amount: totalAmount,
            data: {
                store_id: storeId,
            },
        };

        console.log('payment: ', output);
        return output;
    }

    private async _createCartPayments(cart: Cart): Promise<Payment[]> {
        //unique store ids
        const currencyData = await this._getStoreCurrencyData(cart);
        console.log('store currencies: ', currencyData.store_currencies);
        console.log('uniqueStoreIds: ', currencyData.unique_store_ids);

        //for each unique store, make payment input to create a payment
        const paymentInputs: PaymentDataInput[] = [];
        currencyData.unique_store_ids.forEach((storeId) => {
            paymentInputs.push(
                this._createPaymentInput(
                    cart,
                    storeId,
                    currencyData.store_currencies[storeId]
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

    private async _createOrdersForPayments(
        cart: Cart,
        payments: Payment[]
    ): Promise<Order[]> {
        const promises: Promise<Order>[] = [];
        for (let i = 0; i < payments.length; i++) {
            promises.push(
                this.orderService.createFromPayment(cart.id, payments[i])
            );
        }

        return await Promise.all(promises);
    }
}

export default CartCompletionStrategy;
