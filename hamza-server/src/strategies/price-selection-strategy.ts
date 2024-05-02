import {
    AbstractPriceSelectionStrategy,
    PriceSelectionContext,
    PriceSelectionResult,
} from '@medusajs/medusa';

export default class PriceSelectionStrategy extends AbstractPriceSelectionStrategy {
    async calculateVariantPrice(
        data: {
            variantId: string;
            quantity?: number;
        }[],
        context: PriceSelectionContext
    ): Promise<Map<string, PriceSelectionResult>> {
        console.log('PRICE SELECTION');
        console.log(context);
        const output: Map<string, PriceSelectionResult> = new Map<
            string,
            PriceSelectionResult
        >();
        output.set('one', {
            originalPrice: 1,
            originalPriceIncludesTax: false,
            calculatedPrice: 1,
            prices: [
                {
                    currency_code: 'usdt',
                    amount: 0.01,
                    min_quantity: 0,
                    max_quantity: 1,
                    price_list_id: null,
                    price_list:  null,
                    variants: [],
                    variant: null,
                    variant_id: ''
                    region_id: null
                }],
        });
        return output;
    }
}
