import { Lifetime } from 'awilix';
import { StoreService as MedusaStoreService, Store } from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
    }

    async createStore(user: User): Promise<Store> {
        let owner_id = user.id;
        console.log('owner_id: ', owner_id);
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        let newStore = storeRepo.create();
        // newStore.owner = user; // Set the owner
        newStore.owner_id = owner_id; // Set the owner_id
        newStore = await storeRepo.save(newStore);
        return newStore; // Return the newly created and saved store
    }

    // filter products by

    // async retrieve(config?: FindConfig<Store>): Promise<Store> {
    //   if (!this.loggedInUser_) {
    //     return super.retrieve(config);
    //   }

    //   return this.retrieveForLoggedInUser(config);
    // }

    // async retrieveForLoggedInUser (config?: FindConfig<Store>) {
    //   const storeRepo = this.manager_.withRepository(this.storeRepository_);
    //   const store = await storeRepo.findOne({
    //       ...config,
    //       relations: [
    //         ...config.relations,
    //         'members'
    //       ],
    //       where: {
    //         id: this.loggedInUser_.store_id
    //       },
    //   });

    //   if (!store) {
    //       throw new Error('Unable to find the user store');
    //   }

    //   return store
    // }
}

export default StoreService;
