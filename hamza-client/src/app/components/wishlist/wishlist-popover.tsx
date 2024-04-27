'use client';

import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import WishlistIcon from '@/components/wishlist/wishlist';
import WishlistPopoverItem from './wishlist-popover-item';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { Popover, Transition } from '@headlessui/react';

const WishlistPopover = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const totalItems =
        wishlist?.items?.reduce((acc, item) => {
            return acc + item.quantity;
        }, 0) || 0;
    const itemRef = useRef<number>(totalItems || 0);
    // TODO: Implement the useEffect to grab total items... (reference: cart-dropdown/index.tsx)
    // useEffect(() => {
    //     if (itemRef.current !== totalItems && !pathname.includes('/cart')) {
    //         timedOpen();
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [totalItems, itemRef.current]);

    console.log('Wishlist popover', wishlist);

    const iconStyle = { className: 'mr-1' };

    const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
        undefined
    );
    const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false);

    const open = () => setWishlistDropdownOpen(true);
    const close = () => setWishlistDropdownOpen(false);

    const timedOpen = () => {
        open();

        const timer = setTimeout(close, 5000);

        setActiveTimer(timer);
    };

    const openAndCancel = () => {
        if (activeTimer) {
            clearTimeout(activeTimer);
        }

        open();
    };

    useEffect(() => {
        return () => {
            if (activeTimer) {
                clearTimeout(activeTimer);
            }
        };
    }, [activeTimer]);

    return (
        <div
            className="relative inline-block text-left mr-2"
            onMouseEnter={openAndCancel}
            onMouseLeave={close}
        >
            <Popover className="relative h-full">
                <Popover.Button className="h-full">
                    <LocalizedClientLink href="/wishlist">
                        <div className="inline-flex items-center justify-center w-full rounded p-2 text-sm hover:opacity-1/2">
                            <WishlistIcon {...iconStyle} />
                            <span>Wish List</span>
                        </div>
                    </LocalizedClientLink>
                </Popover.Button>

                <Transition
                    show={wishlistDropdownOpen}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <div className="origin-top-right absolute right-0 mt-2 w-96 px-6 py-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {wishlist.items?.length < 1 ? (
                                <div className="flex justify-center">
                                    <p>Your wish list is empty</p>
                                </div>
                            ) : (
                                <>
                                    {wishlist.items?.map((item) => (
                                        <div
                                            className="py-2 first:pt-0"
                                            key={item.id}
                                        >
                                            <Popover.Button>
                                                {({ active }) => (
                                                    <WishlistPopoverItem
                                                        item={item}
                                                    />
                                                )}
                                            </Popover.Button>
                                        </div>
                                    ))}
                                    <div className="flex flex-col mt-4">
                                        <button className="text-ui-dark py-2 text-sm w-full border px-3 py-1.5 rounded hover:text-black hover:bg-gray-100">
                                            View Wish List
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Transition>
            </Popover>
        </div>
    );
};

export default WishlistPopover;
