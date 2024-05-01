'use client'
import {
    PricedProduct,
    PricedVariant,
} from '@medusajs/medusa/dist/types/pricing';
import { clx } from '@medusajs/ui';

import { getProductPrice } from '@lib/util/get-product-price';
import { RegionInfo } from 'types/global';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

export default function ProductPrice({
    product,
    variant,
    region,
}: {
    product: PricedProduct;
    variant?: PricedVariant;
    region: RegionInfo;
}) {

    const { preferred_currency_code, status } = useCustomerAuthStore();
    const selectedPrices = variant ? variant.prices : product.variants[0].prices;
    let preferredPrice = (status == 'authenticated' && preferred_currency_code && selectedPrices.find(a => a.currency_code == preferred_currency_code)) || null
    if (!selectedPrices) {
        return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />;
    }

    return (
        <div className="flex flex-row space-x-2 text-ui-fg-base text-white">
            {preferredPrice ? <span
                className={clx('text-xl-semi')}
            >
                {preferredPrice.amount} {" "} {preferredPrice.currency_code}
            </span> : <>{selectedPrices.map((price) => {
                return <span
                    className={clx('text-xl-semi')}
                >
                    {price.amount} {" "} {price.currency_code}
                </span>
            })}</>}


        </div>
    );
}
