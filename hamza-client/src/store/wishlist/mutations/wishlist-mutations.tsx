import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';
import useWishlistStore from '@store/wishlist/wishlist-store';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export const Wishlist = () => {
    const { wishlist } = useWishlistStore((state) => ({
        wishlist: state.wishlist,
    }));
    const { customer_id } = useCustomerAuthStore((state) => ({
        customer_id: state.customer_id,
    }));

    const addWishlistItemMutation = useMutation(
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
