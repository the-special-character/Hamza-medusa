'use client';
import React, { useEffect } from 'react';
import useWishlistStore from '@store/wishlist/wishlist-store';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { SimpleGrid } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';

const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    const { customer_id } = useCustomerAuthStore((state) => ({
        customer_id: state.customer_id,
    }));

    // We're just testing getting a logged in customers id here for now...

    console.log('wishlist items??', wishlist.items);

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <h1 className="font-semibold text-4xl text-white text-center">
                        Wishlist
                    </h1>
                    <span>{customer_id}</span>
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
