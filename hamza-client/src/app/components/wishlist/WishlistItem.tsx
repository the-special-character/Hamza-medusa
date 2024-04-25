'use client';

import React from 'react';
import WishlistIcon from './wishlist';
import useWishlistStore from '@store/wishlist/wishlist-store';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const WishlistItem = ({ item }) => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    console.log('WISHLISTITEM', item);
    const { product } = item;

    return (
        <div className="flex mb-6 last:mb-0">
            <div className="bg-ui rounded-md overflow-hidden mr-4 max-w-1/4">
                <img
                    className="h-auto w-full object-cover"
                    src={product.thumbnail}
                    alt={product.title}
                />
            </div>
            <div className="flex text-sm flex-grow py-2 justify-between space-x-8">
                <LocalizedClientLink href={product.handle} className="w-full">
                    <div className="flex flex-col justify-between w-full hover:text-green-400">
                        <div className="flex flex-col">
                            <p className="font-semibold mb-4">
                                {product.title}
                            </p>
                            <p>{product.description}</p>
                        </div>
                    </div>
                </LocalizedClientLink>

                <div className="flex flex-col justify-between">
                    <div className="flex justify-end w-full">
                        <button
                            onClick={async () =>
                                await wishlist.removeWishItem(item.id)
                            }
                        >
                            <WishlistIcon fill={true} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistItem;
