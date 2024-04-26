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
