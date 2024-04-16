import {
    AbstractCartCompletionStrategy,
    Cart,
    CartCompletionResponse,
    IdempotencyKey,
    IdempotencyKeyService,
    ProductService,
    CartService,
    Payment,
} from '@medusajs/medusa';
import { PaymentService } from '@medusajs/medusa/dist/services';
import { PaymentDataInput } from '@medusajs/medusa/dist/services/payment';
import { RequestContext } from '@medusajs/medusa/dist/types/request';

type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    productService: ProductService;
    paymentService: PaymentService;
    cartService: CartService;
};

class CartCompletionStrategy extends AbstractCartCompletionStrategy {
    protected readonly idempotencyKeyService: IdempotencyKeyService;
    protected readonly cartService: CartService;
    protected readonly productService: ProductService;
    protected readonly paymentService: PaymentService;

    constructor({
        idempotencyKeyService,
        productService,
        paymentService,
        cartService,
    }: InjectedDependencies) {
        super(arguments[0]);
        this.idempotencyKeyService = idempotencyKeyService;
        this.cartService = cartService;
        this.paymentService = paymentService;
        this.productService = productService;
    }

    complete(
        cartId: string,
        idempotencyKey: IdempotencyKey,
        context: RequestContext
    ): Promise<CartCompletionResponse> {
        return new Promise<CartCompletionResponse>((resolve, reject) => {
            this.cartService
                .retrieve(cartId, {
                    relations: ['items'],
                })
                .then((cart) => {
                    // Assume the total amount should be split into two payments
                    let total = 2; //TODO: how to get a total from cart?
                    if (!total) total = 2;
                    const halfTotal = total / 2;
                    console.log('cart total:', total);

                    const input1: PaymentDataInput = {
                        currency_code: 'eth',
                        provider_id: 'crypto',
                        amount: halfTotal,
                        data: {},
                    };

                    const input2: PaymentDataInput = {
                        currency_code: 'usdc',
                        provider_id: 'crypto',
                        amount: total - halfTotal,
                        data: {},
                    };

                    // Creating two payments
                    console.log('creating payment 1');
                    this.paymentService.create(input1).then((payment1) => {
                        console.log('creating payment 2');
                        this.paymentService.create(input2).then((payment2) => {
                            const response: CartCompletionResponse = {
                                response_code: 200,
                                response_body: {
                                    payment1: payment1.id,
                                    payment2: payment2.id,
                                    message: 'payment successful',
                                },
                            };
                            console.log('sending response', response);
                            resolve(response);
                        });
                    });
                });

            //return a default value of some sort
            resolve({
                response_code: 500,
                response_body: {
                    message: 'nothing happened',
                },
            });
        });
    }
}

export default CartCompletionStrategy;
