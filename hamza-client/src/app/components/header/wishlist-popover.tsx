import { Menu } from '@headlessui/react';
import LocalizedClientLink from '@modules/common/components/localized-client-link';
import React from 'react';
import WishlistIcon from '../../../icons/wishlist';
import WishlistPopoverItem from './wishlist-popover-item';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { Popover, Transition } from '@headlessui/react';

const WishlistPopover = () => {
    const wishlist = useWishlistStore();
    const iconStyle = { className: 'mr-1' };

    return (
        <Menu as="div" className="relative inline-block text-left mr-2">
            <div>
                <Menu.Button className="inline-flex items-center justify-center w-full rounded p-2 text-sm font-medium hover:opacity-1/2">
                    <WishlistIcon props={iconStyle} />
                    <span>Wish List</span>
                </Menu.Button>
            </div>

            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-96 px-6 py-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                    {wishlist.items < 1 ? (
                        <div className="flex justify-center">
                            <p>Your wish list is empty</p>
                        </div>
                    ) : (
                        <>
                            {wishlist.items?.map((item, i) => {
                                return (
                                    <div className="py-2 first:pt-0" key={i}>
                                        <Menu.Item>
                                            {() => (
                                                <WishlistPopoverItem
                                                    item={item.product}
                                                    currencyCode="usd"
                                                />
                                            )}
                                        </Menu.Item>
                                    </div>
                                );
                            })}
                            <div className="flex flex-col mt-4">
                                <Popover className="relative h-full">
                                    <Popover.Button className="h-full">
                                        <Menu.Item>
                                            <LocalizedClientLink href="/wishlist">
                                                <button className="text-ui-dark py-2 text-sm w-full border px-3 py-1.5 rounded hover:text-black hover:bg-gray-100">
                                                    View Wish List
                                                </button>
                                            </LocalizedClientLink>
                                        </Menu.Item>
                                    </Popover.Button>
                                </Popover>
                            </div>
                        </>
                    )}
                </div>
            </Menu.Items>
        </Menu>
    );
};

export default WishlistPopover;
