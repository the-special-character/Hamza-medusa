import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

type WishlistProduct = {
    id: string;
    product_id: string;
};

type Wishlist = {
    id?: string;
    items: WishlistProduct[];
};

// TODO: clean up this any cast after mutations work
type WishlistType = {
    wishlist: Wishlist;
    loadWishlist: (customer_id: string) => Promise<void>;
    addWishlistProduct: (product: WishlistProduct) => Promise<void>;
    removeWishlistProduct: (product: WishlistProduct) => Promise<void>;
};

const useWishlistStore = create<WishlistType>()(
    persist(
        (set, get) => ({
            wishlist: {
                items: [],
            },
            addWishlistProduct: async (product) => {
                const { wishlist } = get(); // Retrieve the current state
                if (!wishlist || !Array.isArray(wishlist.items)) {
                    console.error(
                        'Initial state not set or corrupted. Resetting to default.'
                    );
                    set({ wishlist: { items: [] } }); // Reset state if corrupted
                }

                // Check if the product is already in the wishlist
                const productExists = wishlist.items.some(
                    (p) => p.product_id === product.product_id
                );
                if (productExists) {
                    console.log(
                        'Product already in wishlist:',
                        product.product_id
                    );
                    return; // Exit the function if product already exists
                }

                // If the product does not exist, add it to the list
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: [...state.wishlist.items, product],
                    },
                }));
            },

            removeWishlistProduct: async (product) => {
                console.log('Removing Wish List product', product);
                set((state) => ({
                    wishlist: {
                        ...state.wishlist,
                        products: state.wishlist.items.filter(
                            (p) => p.id !== product.id
                        ),
                    },
                }));
            },
            loadWishlist: async (customer_id) => {
                if (!customer_id) {
                    console.error('No customer ID available');
                    return;
                }
                try {
                    const response = await axios.get(
                        `http://localhost:9000/custom/wishlist?customer_id=${customer_id}`
                    );
                    const items = response.data.items;
                    if (Array.isArray(items)) {
                        set({ wishlist: { items } });
                    } else {
                        console.error(
                            'Failed to load wishlist: Invalid data format'
                        );
                    }
                } catch (error) {
                    console.error('Failed to load wishlist:', error);
                }
            },
        }),
        {
            name: 'wishlist-storage',
            storage: createJSONStorage(() => localStorage),
            // Optional: You can trigger loadWishlist after the store has been rehydrated from localStorage
            onRehydrateStorage: () => (state, error) => {
                console.log('Rehydration working');
                if (error) {
                    console.error('Failed to rehydrate:', error);
                    return;
                }
                document.addEventListener('customerAuthRehydrated', () => {
                    const customer_id = JSON.parse(
                        localStorage.getItem('__hamza_customer')
                    ).customer_id;
                    if (customer_id) {
                        state.loadWishlist(customer_id);
                    }
                });
            },
        }
    )
);

export default useWishlistStore;
