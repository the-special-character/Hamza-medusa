'use client';
import React from 'react';
import useWishlistStore from '@store/wishlist/wishlist-store';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { SimpleGrid } from '@chakra-ui/react';
import { useMeCustomer } from 'medusa-react';

const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    // We're just testing getting a logged in customers id here for now...
    const { customer, isLoading } = useMeCustomer();

    console.log('wishlist items??', wishlist.items);

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <h1 className="font-semibold text-4xl text-white text-center">
                        Wishlist
                    </h1>
                    {isLoading && <p>Loading...</p>}
                    {customer && (
                        <span>
                            {customer.id} {customer.email}
                        </span>
                    )}
                </div>
                <div className="w-full px-16">
                    <SimpleGrid
                        columns={{ base: 1, md: 2, lg: 4 }}
                        justifyContent="center" // Ensure that grid items are centered if they don't fill the entire row
                        spacing={5}
                        className="text-white"
                    >
                        {wishlist.items.map((item) => {
                            return (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    currencyCode={
                                        wishlist.region?.currency_code || 'usd'
                                    }
                                />
                            );
                        })}
                    </SimpleGrid>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
