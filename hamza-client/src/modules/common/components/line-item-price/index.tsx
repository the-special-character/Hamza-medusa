import { formatAmount } from '@lib/util/prices';
import { LineItem as MedusaLineItem } from '@medusajs/medusa';
import { Region } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';

import { getPercentageDiff } from '@lib/util/get-precentage-diff';
import { CalculatedVariant } from 'types/medusa';
import { formatCryptoPrice } from '@lib/util/get-product-price';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

class LineItem extends MedusaLineItem {
    currency_code: string = 'usdt';
}

type LineItemPriceProps = {
    item: Omit<LineItem, 'beforeInsert'>;
    region: Region;
    style?: 'default' | 'tight';
};

const LineItemPrice = ({
    item,
    region,
    style = 'default',
}: LineItemPriceProps) => {
    const originalPrice =
        (item.variant as CalculatedVariant).original_price * item.quantity;
    const hasReducedPrice = (item.total || 0) < originalPrice;

    return (
        <div className="flex flex-col gap-x-2 text-ui-fg-subtle items-end">
            <div className="text-left">
                {hasReducedPrice && (
                    <>
                        <p>
                            {style === 'default' && (
                                <span className="text-ui-fg-subtle">
                                    Original:{' '}
                                </span>
                            )}
                            <span className="line-through text-ui-fg-muted">
                                {formatCryptoPrice(
                                    originalPrice,
                                    item.currency_code ?? 'usdt'
                                )}{' '}
                                {item.currency_code?.toUpperCase() ?? ''}
                            </span>
                        </p>
                        {style === 'default' && (
                            <span className="text-ui-fg-interactive">
                                -
                                {getPercentageDiff(
                                    originalPrice,
                                    item.total || 0
                                )}
                                %
                            </span>
                        )}
                    </>
                )}
                <span
                    className={clx('text-base-regular', {
                        'text-ui-fg-interactive': hasReducedPrice,
                    })}
                >
                    {!isNaN(originalPrice) &&
                        formatCryptoPrice(originalPrice, item.currency_code) +
                            ' ' +
                            (item.currency_code?.toUpperCase() ?? '')}
                </span>
            </div>
        </div>
    );
};

export default LineItemPrice;
