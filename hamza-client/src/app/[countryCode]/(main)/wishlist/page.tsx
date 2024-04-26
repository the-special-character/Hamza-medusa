'use client';
import React, { useEffect } from 'react';
import useWishlistStore from '@store/wishlist/wishlist-store';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { SimpleGrid } from '@chakra-ui/react';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import axios from 'axios';
import { useWishlistMutations } from '@store/wishlist/mutations/wishlist-mutations';

const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    const { customer_id } = useCustomerAuthStore((state) => ({
        customer_id: state.customer_id,
    }));

    useEffect(() => {
        const getOrCreateWishlist = async () => {
            try {
                // Attempt to fetch the wishlist
                const { data } = await axios.get(
                    `http://localhost:9000/custom/wishlist?customer_id=${customer_id}`
                );
                console.log('Wishlist Data:', data);
            } catch (error) {
                // If wishlist does not exist, create a new one
                console.error(
                    'Wishlist does not exist so creating one...',
                    error
                );
                try {
                    // Make a POST request to create a new wishlist
                    const response = await axios.post(
                        'http://localhost:9000/custom/wishlist',
                        {
                            customer_id: customer_id,
                        }
                    );
                    console.log('New Wishlist created:', response.data);
                } catch (createError) {
                    console.error('Error creating wishlist:', createError);
                }
            }
        };

        console.log('Customer ID:', customer_id);
        getOrCreateWishlist();
    }, [customer_id]);
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
                    {wishlist && wishlist.items && wishlist.items.length > 0 ? (
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            justifyContent="center" // Ensure that grid items are centered if they don't fill the entire row
                            spacing={5}
                            className="text-white"
                        >
                            {wishlist.items.map((item) => (
                                <WishlistItem
                                    key={item.id}
                                    item={item}
                                    currencyCode={
                                        wishlist.region?.currency_code || 'usd'
                                    }
                                />
                            ))}
                        </SimpleGrid>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
