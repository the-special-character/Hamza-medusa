import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type WishlistItem = {
    id: string;
    product_id: string;
    wishlist_id: string;
};

type Wishlist = {
    id?: string;
    products: WishlistItem[];
};

// TODO: clean up this any cast after mutations work
type WishlistType = {
    wishlist: Wishlist;
    addWishlistProduct: (product: any) => Promise<void>;
    removeWishlistProduct: (product: any) => Promise<void>;
};

const useWishlistStore = create<WishlistType>()(
    persist(
        (set, get) => ({
            wishlist: {
                products: [],
            },
            addWishlistProduct: async (product) => {
                console.log('Adding product:', product);
                const { wishlist } = get(); // Retrieve the current state
                localStorage.setItem('WISHLIST_ID', wishlist.id || '');
                set((state) => ({
                    wishlist: {
                        products: [...state.wishlist.products, product],
                    },
                }));
            },
            removeWishlistProduct: async (product) => {
                console.log('Removing Wish List product', product);
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: state.wishlist.products.filter(
                            (i) => i !== product
                        ),
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
