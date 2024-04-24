import React, { useEffect, useState} from "react"
import { useMedusa, useRegion } from "medusa-react"
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from "axios";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type WishlistItem = {
    id: string
    product_id: string
    wishlist_id: string
}

type Wishlist = {
    id?: string
    items: WishlistItem[]
}

type WishlistType = {
    wishlist: Wishlist;
    loading: boolean;
    actions: {
        addItem: (product_id: string) => Promise<void>;
        removeItem: (id: string) => Promise<void>;
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
}

const useWishlistStore = create(persist((set) => ({
    wishlist: {
        items: [],
    },
    loading: false,
    actions: {
        addWishlistItem: async (item) => {
            set((state) => ({
                wishlist: {
                    items: [...state.wishlist.items, item],
                }
            }));
        },
        removeWishlistItem: async (item) => {
            set((state) => ({
                wishlist: {
                    items: state.wishlist.items.filter(i => i !== item),
                }
            }));
        },
    },
}), {
    name: 'wishlist-storage', // name of the item in the storage
}));

export default useWishlistStore

interface WishlistProviderProps {
    productIds: string[];
    countryCode: string;
}


const WISHLIST_ID = "wishlist_id"
const isBrowser = typeof window !== "undefined"


export const Wishlist: React.FC<WishlistProviderProps> = ({ children, productIds, countryCode }) => {
    const { region } = useRegion(countryCode)

    const setWishlistItem = (wishlist: Wishlist) => {
        if (isBrowser) {
            localStorage.setItem(WISHLIST_ID, wishlist.id || '')
        }
        setWishlist(wishlist)
    }

    useEffect(() => {
        const initializeWishlist = async () => {
            const existingWishlistId = isBrowser
                ? localStorage.getItem(WISHLIST_ID)
                : null

            if (existingWishlistId && existingWishlistId !== "undefined") {
                try {
                    const query = ['wish', { region: region?.id }]
                    const fetchWishlist = () => axios.get(`/store/wishlist${existingWishlistId}`)

                    const { data, error: error, isLoading: boolean } = useQuery(query, fetchWishlist)

                    if (data) {
                        setWishlistItem(data?.data)
                        return
                    }
                } catch (e) {
                    localStorage.setItem(WISHLIST_ID, '')
                }
            }
            initializeWishlist()
        }, [region])

            if (region) {
                try{
                    const query = ['wish', { region: region.id }]
                    const fetchWishlist = () => axios.get(`/store/wishlist`, {
                    params: {
                        region: region.id,
                    },
                })

                    const {data, error, isLoading} = useQuery(query, fetchWishlist)
                    if (data){
                        setWishlistItem(data?.data)
                        setLoading(false)
                    } else if (error){
                        console.log(error)
                    }
                }
                catch(e){
                    console.log(e)
                }
            }
        }



    const addWishItem = (product_id: string) => {
        try {
            const query = ['item', { product_id: product_id }]
            const fetchWishlist = () => axios.get(`/store/wishlist/${wishlist.id}/wish-item`)
            const { data, error, isLoading } = useMutation(query, fetchWishlist)
            setWishlistItem(data?.data)
        } catch (e) {
            console.log(e)
        }
    }

    const removeWishItem = (product_id: string) => {
        try {
            const query = ['item', { product_id: product_id }]
            const fetchWishlist = () => axios.get(`/store/wishlist/${wishlist.id}/wish-item/${product_id}`)
            const { data, error, isLoading } = useMutation(query, fetchWishlist)
            setWishlistItem(data?.data)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        {wishlist}
);


}
