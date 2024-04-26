import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import useWishlistStore from '@store/wishlist/wishlist-store';

export function useWishlistMutations() {
    const { addWishlistProduct, removeWishlistProduct } = useWishlistStore(
        (state) => ({
            addWishlistProduct: state.addWishlistProduct,
            removeWishlistProduct: state.removeWishlistProduct,
        })
    );
    const { customer_id } = useCustomerAuthStore((state) => state.customer_id);

    const addWishlistItemMutation = useMutation(
        (product) =>
            axios.post(`localhost:9000/custom/wishlist/item`, {
                customer_id: customer_id,
                product_id: product.id,
            }),
        {
            onSuccess: (data) => {
                console.log('Adding Wish list item in DB!');
                addWishlistProduct(product);
            },
            onError: (error) => {
                console.error('Error adding item to wishlist', error);
            },
        }
    );

    const removeWishlistItemMutation = useMutation(
        (product) =>
            axios.delete(`localhost:9000/custom/wishlist/item`, {
                data: {
                    customer_id: customer_id,
                    product_id: product.id,
                },
            }),
        {
            onSuccess: (data) => {
                console.log('Removing Wish List item in DB');
                removeWishlistProduct(product);
            },
            onError: (error) => {
                console.error('Error removing item from wishlist', error);
            },
        }
    );

    return { addWishlistItemMutation, removeWishlistItemMutation };
}
