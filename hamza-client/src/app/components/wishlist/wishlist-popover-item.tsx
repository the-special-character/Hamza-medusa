import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Image from 'next/image';
import { WishlistItem } from '@store/wishlist/types/wishlist-types';

interface WishlistPopoverItemProps {
    item: WishlistItem;
}

const WishlistPopoverItem: React.FC<WishlistPopoverItemProps> = ({ item }) => {
    console.log('Wishlist popover item', item, typeof item);
    return (
        <LocalizedClientLink
            href={`/products/${item.product.handle}`}
            className="font-normal"
        >
            <div className="flex hover:bg-gray-100">
                <div className="overflow-hidden rounded-md mr-4">
                    <Image
                        className="w-16 h-auto"
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        width="300"
                        height="200"
                    />
                </div>
                <div className="flex items-center">
                    <div>
                        <p className="font-medium text-sm">
                            {item.product.title}
                        </p>
                    </div>
                </div>
            </div>
        </LocalizedClientLink>
    );
};

export default WishlistPopoverItem;
