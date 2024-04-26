'use client';

import React from 'react';
import WishlistIcon from './wishlist';
import useWishlistStore from '@store/wishlist/wishlist-store';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import Image from 'next/image';

const WishlistItem = ({ item, currencyCode }) => {
    const removeWishlistItem = useWishlistStore(
        (state) => state.removeWishlistItem
    );

    return (
        <div className="flex mb-6 last:mb-0">
            <div className="bg-ui rounded-md overflow-hidden mr-4 max-w-1/4">
                <Image
                    className="h-auto w-full object-cover"
                    src={item.thumbnail}
                    width="300"
                    height="200"
                    alt={item.title}
                />
            </div>
            <div className="flex text-sm flex-grow py-2 justify-between space-x-8">
                <LocalizedClientLink href={item.handle} className="w-full">
                    <div className="flex flex-col justify-between w-full hover:text-green-400">
                        <div className="flex flex-col">
                            <p className="font-semibold mb-4">{item.title}</p>
                            <p>{item.description}</p>
                        </div>
                    </div>
                </LocalizedClientLink>

                <div className="flex flex-col justify-between">
                    <div className="flex justify-end w-full">
                        <button onClick={() => removeWishlistItem(item)}>
                            <WishlistIcon fill={true} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;
