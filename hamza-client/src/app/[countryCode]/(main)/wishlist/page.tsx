'use client';
import React, { useEffect } from 'react';
import useWishlistStore from '@store/wishlist/wishlist-store';
import WishlistItem from '@/components/wishlist/WishlistItem';
import { SimpleGrid } from '@chakra-ui/react';

const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));

    console.log('wishlist items??', wishlist?.items);

    return (
        <div className="layout-base bg-black flex justify-center min-h-screen">
            <div className="flex flex-col items-center w-full">
                <div className="my-8">
                    <h1 className="font-semibold text-4xl text-white text-center">
                        Wishlist
                    </h1>
                </div>
                <div className="w-full px-16">
                    {wishlist &&
                    wishlist.items &&
                    wishlist.items?.length > 0 ? (
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            justifyContent="center" // Ensure that grid items are centered if they don't fill the entire row
                            spacing={5}
                            className="text-white"
                        >
                            {wishlist.items?.map((item) => (
                                <WishlistItem
                                    key={item.id}
                                    item={item.product}
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
