import React, { useEffect, useState } from 'react';
import { useRegion, useMeCustomer } from 'medusa-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

// TODO: Refactor to pull useWishlistStore from this component or the Wishlist component to create a sort of separation (e.g. useWishlistStore.tsx)

type WishlistItem = {
    id: string;
    product_id: string;
    wishlist_id: string;
};

type Wishlist = {
    id?: string;
    items: WishlistItem[];
};

// TODO: clean up this any cast after mutations work
type WishlistType = {
    wishlist: Wishlist;
    addWishlistItem: (product: any) => Promise<void>;
    removeWishlistItem: (product: any) => Promise<void>;
};

const useWishlistStore = create<WishlistType>()(
    persist(
        (set, get) => ({
            wishlist: {
                items: [],
            },
            addWishlistItem: async (item) => {
                console.log('Adding item:', item);
                const { wishlist } = get(); // Retrieve the current state
                localStorage.setItem('WISHLIST_ID', wishlist.id || '');
                set((state) => ({
                    wishlist: {
                        items: [...state.wishlist.items, item],
                    },
                }));
            },
            removeWishlistItem: async (item) => {
                console.log('Removing Wish List item', item);
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        items: state.wishlist.items.filter((i) => i !== item),
                    },
                }));
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useWishlistStore;

export const Wishlist = () => {
    const { customer_id } = useCustomerAuthStore((state) => ({
        customer_id: state.customer_id,
    }));

    const addWishlistMutation = useMutation(
        (product_id) =>
            axios.post(`localhost:9000/custom/wishlist/item`, {
                customer_id: customer_id,
                product_id: product_id,
            }),
        {
            onSuccess: (data) => {
                console.log('Adding Wish list item in DB!');
            },
            onError: (error) => {
                console.log('Error adding item to wishlist', error);
            },
        }
    );

    // now we will refactor removeWishItem to removeWishlistItemMutation

    const removeWishlistItemMutation = useMutation(
        (product_id) =>
            axios.delete(`localhost:9000/custom/wishlist/item`, {
                customer_id: customer_id,
                product_id: product_id,
            }),
        {
            onSuccess: (data) => {
                console.log('Removing Wish List item in DB');
            },
            onError: (error) => {
                console.log('Error removing item from wishlist', error);
            },
        }
    );
};
