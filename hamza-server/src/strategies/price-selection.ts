import {
    AbstractPriceSelectionStrategy,
    CustomerService,
    PriceSelectionContext,
    PriceSelectionResult,
    ProductVariant,
} from '@medusajs/medusa';
import ProductVariantRepository from '@medusajs/medusa/dist/repositories/product-variant';
import { In } from 'typeorm';

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
        //if we have a customer, then we will check for preferred currency
        const preferredCurrency: string =
            await this.getCustomerPreferredCurrency(context.customer_id);

        //get all relevant variants, including preferred currency (if any)
        return await this.getPricesForVariants(
            data.map((d) => d.variantId), //variant ids
            preferredCurrency
        );
    }

    private async getCustomerPreferredCurrency(
        customerId: string = null
    ): Promise<string> {
        if (customerId) {
            const customer = await this.customerService_.retrieve(customerId);
            return customer?.preferred_currency_id;
        }

        return null;
    }

    private async getPricesForVariants(
        variantIds: string[],
        preferredCurrencyId: string = null
    ): Promise<Map<string, PriceSelectionResult>> {
        const output: Map<string, PriceSelectionResult> = new Map<
            string,
            PriceSelectionResult
        >();

        //get the variant objects
        const variants: ProductVariant[] =
            await this.productVariantRepository_.find({
                where: { id: In(variantIds) },
                relations: ['product', 'prices'],
            });

        //if no preferred currency, just return all prices
        for (const v of variants) {
            let prices = v.prices;

            //if preferred currency, filter out the non-matchers
            if (preferredCurrencyId) {
                prices = prices.filter(
                    (p) => p.currency_code == preferredCurrencyId
                );

                //if no matchers, then just return all
                if (!prices.length) prices = v.prices;
            }

            //gather and return the output
            output.set(v.id, {
                originalPrice: prices.length ? prices[0].amount : 0,
                calculatedPrice: prices.length ? prices[0].amount : 0,
                originalPriceIncludesTax: false,
                prices: prices,
            });
        }

        return output;
    }
}
