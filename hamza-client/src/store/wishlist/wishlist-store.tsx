import React, { useEffect, useState } from 'react';
import { useRegion } from 'medusa-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: {
                items: [
                    {
                        id: '1',
                        title: 'The Futurist Visor',
                        thumbnail: 'http://54.253.186.85/dalle_black_vr.webp',
                        handle: 'headset_future',
                    },
                    {
                        id: '2',
                        title: 'The Streamline Rift',
                        thumbnail: 'http://54.253.186.85/dalle_vr_2.webp',
                        handle: 'headset_sleek',
                    },
                    {
                        id: '3',
                        title: 'The Orbit Headset',
                        thumbnail: 'http://54.253.186.85/dalle_vr_headset.webp',
                        handle: 'headset_aural',
                    },
                ],
            },
            loading: false,
            actions: {
                addWishlistItem: async (item) => {
                    console.log('Adding item:', item);
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
                    console.log('Removing Wish List item', item);
                    set((state) => ({
                        wishlist: {
                            ...state.wishlist,
                            items: state.wishlist.items.filter(
                                (i) => i !== item
                            ),
                        },
                    }));
                },
                setWishlist: async (wishlist) => {
                    set((state) => ({ wishlist }));
                },
            },
        }),
        {
            name: 'wishlist-storage', // name of the item in the storage
            // TODO: Local Storage is failing and only saving first item.
            // storage: createJSONStorage(() => sessionStorage), // Specify how to access the storage
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
    // Let's now use the useWishlistStore hook to get the wishlist state and actions
    const { actions } = useWishlistStore((state) => ({
        actions: state.actions,
    }));
    const { region } = useRegion(countryCode);

    // TODO: Set initial wishlist if it already exists in localStorage
    // useEffect(() => {
    //     const fetchInitialWishlist = async () => {
    //         if (isBrowser) {
    //         }
    //     };
    // });

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
