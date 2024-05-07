import {
    AbstractPriceSelectionStrategy,
    CustomerService,
    PriceSelectionContext,
    PriceSelectionResult,
    ProductVariant,
} from '@medusajs/medusa';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';

type InjectedDependencies = {
    customerService: CustomerService;
    productVariantRepository: typeof ProductVariantRepository;
};

export default class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
    protected readonly customerService_: CustomerService;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;

    constructor({
        customerService,
        productVariantRepository,
    }: InjectedDependencies) {
        super(arguments[0]);

        this.customerService_ = customerService;
        this.productVariantRepository_ = productVariantRepository;
    }

    async calculateVariantPrice(
        data: {
            variantId: string;
            quantity?: number;
        }[],
        context: PriceSelectionContext
    ): Promise<Map<string, PriceSelectionResult>> {
        console.log('PRICE SELECTION:', context);
        const output: Map<string, PriceSelectionResult> = new Map<
            string,
            PriceSelectionResult
        >();
        //const dataMap = new Map(data.map((d) => [d.variantId, d]));

        let preferredCurrency: string = 'eth';

        if (context.customer_id) {
            const customer = await this.customerService_.retrieve(
                context.customer_id
            );

            preferredCurrency = customer.preferred_currency_id;
            console.log('user preferred currency is ', preferredCurrency);

            /*
            if (preferred) {
                const variant: ProductVariant =
                    await this.productVariantService_.retrieve(
                        data[0].variantId,
                        {
                            relations: ['product', 'prices'],
                        }
                    );

                if (variant) {
                    for (const price of variant.prices) {
                        if (price.currency_code == preferred) {
                            output.set(preferred, {
                                originalPrice: 11,
                                originalPriceIncludesTax: false,
                                calculatedPrice: 11,
                                prices: [price],
                            });

                            return output;
                        }
                    }
                }
            }
            */
        }

        for (const d of data) {
            const variant: ProductVariant =
                await this.productVariantRepository_.findOne({
                    where: { id: d.variantId },
                    relations: ['product', 'prices'],
                });

            for (const price of variant.prices) {
                if (price.currency_code == preferredCurrency) {
                    output.set(variant.id, {
                        originalPrice: price.amount,
                        originalPriceIncludesTax: false,
                        calculatedPrice: price.amount,
                        prices: [price],
                    });
                }
            }
        }

        return output;
    }
}
