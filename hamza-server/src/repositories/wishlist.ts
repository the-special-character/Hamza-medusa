import { Wishlist } from '../models/wishlist';
import { dataSource } from '@medusajs/medusa/dist/loaders/database';
import { Repository } from 'typeorm';

export const WishlistRepository = dataSource.getRepository(Wishlist).extend({
    ...Object.assign(Repository, { target: Wishlist }),
});
