import React, { useEffect, useState } from 'react';
import { useRegion } from 'medusa-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistItem = {
    id: string;
    product_id: string;
    wishlist_id: string;
};

type Wishlist = {
    id?: string;
    items: WishlistItem[];
};

type WishlistType = {
    wishlist: Wishlist;
    loading: boolean;
    actions: {
        addItem: (product_id: string) => Promise<void>;
        removeItem: (product_id: string) => Promise<void>;
    };
};

const defaultWishlist: WishlistType = {
    wishlist: {
        items: [],
    },
    loading: false,
    actions: {
        addItem: async () => {},
        removeItem: async () => {},
    },
};

// TODO: Refactor to pull useWishlistStore from this component or the Wishlist component to create a sort of separation (e.g. useWishlistStore.tsx)
export const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: {
                items: [],
                id: '',
            },
            loading: false,
            actions: {
                addWishlistItem: async (item) => {
                    const { wishlist } = get(); // Retrieve the current state
                    localStorage.setItem(WISHLIST_ID, wishlist.id || '');
                    set((state) => ({
                        wishlist: {
                            ...state.wishlist,
                            items: [...state.wishlist.items, item],
                        },
                    }));
                },
                removeWishlistItem: async (item) => {
                    set((state) => ({
                        wishlist: {
                            ...state.wishlist,
                            items: state.wishlist.items.filter(
                                (i) => i !== item
                            ),
                        },
                    }));
                },
            },
        }),
        {
            name: 'wishlist-storage', // name of the item in the storage
            getStorage: () => localStorage, // Specify how to access the storage
        }
    )
);

interface WishlistProps {
    productIds: string[];
    countryCode: string;
}

const WISHLIST_ID = 'wishlist_id';
const isBrowser = typeof window !== 'undefined';

export const Wishlist = ({ productIds, countryCode }: WishlistProps) => {
    const { region } = useRegion(countryCode);

    // Let's now use the useWishlistStore hook to get the wishlist state and actions
    const { actions } = useWishlistStore((state) => ({
        actions: state.actions,
    }));

    const addWishlistMutation = useMutation(
        (product_id) =>
            axios.post(`/store/wishlist/${wishlist.id}/wish-item`, {
                product_id,
            }),
        {
            onSuccess: (data) => {
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
                actions.removeWishlistItem(data);
            },
            onError: (error) => {
                console.log('Error removing item from wishlist', error);
            },
        }
    );
};
