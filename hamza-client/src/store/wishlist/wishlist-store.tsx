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

interface WishlistProps {
    productIds: string[];
    countryCode: string;
}

// TODO: Speaking of separation, based off Medusas Architecture, should this component be an action?
export const Wishlist = ({ productIds, countryCode }: WishlistProps) => {
    // Let's now use the useWishlistStore hook to get the wishlist state and actions
    const { actions } = useWishlistStore((state) => ({
        actions: state.actions,
    }));
    const { region } = useRegion(countryCode);

    const addWishlistMutation = useMutation(
        (product_id) =>
            axios.post(`/store/wishlist/${wishlist.id}/wish-item`, {
                product_id,
            }),
        {
            onSuccess: (data) => {
                console.log('Adding Wish list item');
                actions.addWishlistItem(data);
            },
            onError: (error) => {
                console.log('Error adding item to wishlist', error);
            },
        }
    );

    // now we will refactor removeWishItem to removeWishlistItemMutation

    const removeWishlistItemMutation = useMutation(
        (product_id) =>
            axios.delete(
                `/store/wishlist/${wishlist.id}/wish-item/${product_id}`
            ),
        {
            onSuccess: (data) => {
                console.log('Removing Wish List item');
                actions.removeWishlistItem(data);
            },
            onError: (error) => {
                console.log('Error removing item from wishlist', error);
            },
        }
    );
};
