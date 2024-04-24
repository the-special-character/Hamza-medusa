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

const useWishlistStore = create(
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

export default useWishlistStore;

interface WishlistProps {
    productIds: string[];
    countryCode: string;
}

const WISHLIST_ID = 'wishlist_id';
const isBrowser = typeof window !== 'undefined';

export const Wishlist = ({ productIds, countryCode }: WishlistProps) => {
    const { region } = useRegion(countryCode);

    const addWishItem = (product_id: string) => {
        try {
            const query = ['item', { product_id: product_id }];
            const fetchWishlist = () =>
                axios.get(`/store/wishlist/${wishlist.id}/wish-item`);
            const { data, error, isLoading } = useMutation(
                query,
                fetchWishlist
            );
            setWishlistItem(data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    const removeWishItem = (product_id: string) => {
        try {
            const query = ['item', { product_id: product_id }];
            const fetchWishlist = () =>
                axios.get(
                    `/store/wishlist/${wishlist.id}/wish-item/${product_id}`
                );
            const { data, error, isLoading } = useMutation(
                query,
                fetchWishlist
            );
            setWishlistItem(data?.data);
        } catch (e) {
            console.log(e);
        }
    };

    return { wishlist };
};
