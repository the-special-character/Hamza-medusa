'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React from 'react';
import WishlistIcon from '@/components/wishlist/wishlist';
import WishlistPopoverItem from './wishlist-popover-item';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { Popover, Transition } from '@headlessui/react';

const WishlistPopover = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const iconStyle = { className: 'mr-1' };

    return (
        <Popover className="relative inline-block text-left mr-2">
            <div>
                <Popover.Button className="inline-flex items-center justify-center w-full rounded p-2 text-sm font-medium hover:opacity-1/2">
                    <WishlistIcon {...iconStyle} />
                    <span>Wish List</span>
                </Popover.Button>
            </div>

            <Popover.Button className="origin-top-right absolute right-0 mt-2 w-96 px-6 py-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                    {wishlist.items.length < 1 ? (
                        <div className="flex justify-center">
                            <p>Your wish list is empty</p>
                        </div>
                    ) : (
                        <>
                            {wishlist.items.map((item) => (
                                <div className="py-2 first:pt-0" key={item.id}>
                                    <Popover.Button>
                                        {({ active }) => (
                                            <WishlistPopoverItem
                                                item={item.product}
                                                currencyCode="usd"
                                            />
                                        )}
                                    </Popover.Button>
                                </div>
                            ))}
                            <div className="flex flex-col mt-4">
                                <Popover.Button>
                                    <LocalizedClientLink href="/wishlist">
                                        <button className="text-ui-dark py-2 text-sm w-full border px-3 py-1.5 rounded hover:text-black hover:bg-gray-100">
                                            View Wish List
                                        </button>
                                    </LocalizedClientLink>
                                </Popover.Button>
                            </div>
                        </>
                    )}
                </div>
            </Popover.Button>
        </Popover>
    );
};

export default WishlistPopover;
