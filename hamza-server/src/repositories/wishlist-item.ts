import { WishlistItem } from '../models/wishlist-item';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';

export const WishlistItemRepository = dataSource
    .getRepository(WishlistItem)
    .extend({
        ...Object.assign(Repository, { target: WishlistItem }),
    });
