import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import WishlistService from '../../../../services/wishlist';

// ADD Wishlist `item` by customer_id
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');
    const { customer_id, product_id } = req.body; // Extract customer_id and product_id from request body

    try {
        const wishlist = await wishlistService.addWishItem(
            customer_id,
            product_id
        );
        res.json(wishlist);
    } catch (err) {
        console.log('ERROR: ', err);
        res.status(500).send('Internal Server Error');
    }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const wishlistService: WishlistService =
        req.scope.resolve('wishlistService');
    const { customer_id, product_id } = req.body; // Extract customer_id and product_id from request body

    try {
        // Call removeWishItem instead of addWishItem
        const wishlist = await wishlistService.removeWishItem(
            customer_id,
            product_id
        );
        res.json(wishlist);
    } catch (err) {
        console.log('ERROR: ', err);
        res.status(500).send('Internal Server Error');
    }
};
