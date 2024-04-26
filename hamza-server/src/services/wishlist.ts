import { TransactionBaseService } from '@medusajs/medusa/dist/interfaces';
import { MedusaError } from 'medusa-core-utils';
import { Lifetime } from 'awilix';
import { WishlistItem } from '../models/wishlist-item';
import { Wishlist } from '../models/wishlist';

interface CreateWishlistPayload {
    region_id: string;
    customer_id: string;
}
class WishlistService extends TransactionBaseService {
    static LIFE_TIME = Lifetime.SCOPED;

    // TODO: Use BaseRepository instead of injecting repositories

    constructor(container) {
        super(container);
    }

    // TODO: Running this multiple times should NOT create multiple wishlists, look into how to prevent this && how atomicPhase_ works
    // XGH NOTE: atomicPhase_ handles dB transactions in a safe and isolated way, method is designed to encapsulate the block of
    // transactional work to ensure ALL operations are completed successfully or none are.- GN
    async create(payload: CreateWishlistPayload) {
        return await this.atomicPhase_(async (transactionManager) => {
            if (!payload.customer_id) {
                throw new MedusaError(
                    MedusaError.Types.INVALID_DATA,
                    `A customer_id must be provided when creating a wishlist`
                );
            }

            const wishlistRepository =
                this.activeManager_.getRepository(Wishlist);

            // Check if a wishlist already exists for the customer_id
            const existingWishlist = await wishlistRepository.findOne({
                where: { customer_id: payload.customer_id },
            });

            if (existingWishlist) {
                // Wishlist already exists, return it
                console.log('Wishlist already exists for this customer');
                return existingWishlist;
            }

            const createdWishlist = wishlistRepository.create(payload);
            const savedWishList =
                await wishlistRepository.save(createdWishlist);

            const [wishlist] = await wishlistRepository.find({
                where: { id: savedWishList.id },
                relations: ['items', 'items.product'],
            });

            return wishlist;
        });
    }

    async retrieve(customer_id) {
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            const [wishlist] = await wishlistRepository.find({
                where: { customer_id },
                relations: ['items', 'items.product'],
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist with customer_id ${customer_id} was not found`
                );
            }
            return wishlist;
        });
    }

    async addWishItem(customer_id, product_id) {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            // Find the wishlist based on the customer_id
            const wishlist = await wishlistRepository.findOne({
                where: { customer_id },
            });

            if (!wishlist) {
                throw new MedusaError(
                    MedusaError.Types.NOT_FOUND,
                    `Wishlist not found for customer with ID ${customer_id}`
                );
            }

            // Check if the item already exists in the wishlist
            const [item] = await wishlistItemRepository.find({
                where: { wishlist_id: wishlist.id, product_id },
            });

            if (!item) {
                // Create a new wishlist item if it doesn't already exist
                const createdItem = wishlistItemRepository.create({
                    wishlist_id: wishlist.id,
                    product_id,
                });
                await wishlistItemRepository.save(createdItem);
            }

            // Fetch the updated wishlist with items
            const updatedWishlist = await wishlistRepository.findOne({
                where: { id: wishlist.id },
                relations: ['items', 'items.product'],
            });

            return updatedWishlist;
        });
    }

    async removeWishItem(id) {
        const wishlistItemRepository =
            this.activeManager_.getRepository(WishlistItem);
        const wishlistRepository = this.activeManager_.getRepository(Wishlist);
        return await this.atomicPhase_(async (transactionManager) => {
            const [item] = await wishlistItemRepository.find({ where: { id } });
            const wishlist_id = item.wishlist_id;

            if (item) {
                await wishlistItemRepository.remove(item);
            }

            const [wishlist] = await wishlistRepository.find({
                where: { id: wishlist_id },
                relations: ['items', 'items.product'],
            });

            return wishlist;
        });
    }
}

export default WishlistService;
