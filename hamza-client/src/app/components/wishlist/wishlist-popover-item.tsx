import React from 'react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Image from 'next/image';

const WishlistPopoverItem = ({ item }) => {
    console.log('Wishlist popover item', item.handle);
    return (
        <LocalizedClientLink
            href={`/products/${item.handle}`}
            className="font-normal"
        >
            <div className="flex hover:bg-gray-100">
                <div className="overflow-hidden rounded-md mr-4">
                    <Image
                        className="w-16 h-auto"
                        src={item.thumbnail}
                        alt={item.title}
                        width="300"
                        height="200"
                    />
                </div>
                <div className="flex items-center">
                    <div>
                        <p className="font-medium text-sm">{item.title}</p>
                    </div>
                </div>
            </div>
        </LocalizedClientLink>
    );
};

export default WishlistPopoverItem;
