import { Lifetime } from 'awilix';
import { StoreService as MedusaStoreService, Store } from '@medusajs/medusa';
import { User } from '../models/user';
import StoreRepository from '../repositories/store';
import axios from 'axios';

class StoreService extends MedusaStoreService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly storeRepository_: typeof StoreRepository;

    constructor(container) {
        super(container);
        this.storeRepository_ = container.storeRepository;
    }

    async createStore(
        user: User,
        store_name: string,
        collection: string
    ): Promise<Store> {
        let owner_id = user.id;
        console.log('owner_id: ', owner_id);
        const storeRepo = this.manager_.withRepository(this.storeRepository_);
        let newStore = storeRepo.create();
        // newStore.owner = user; // Set the owner
        newStore.name = store_name; // Set the store name
        newStore.owner_id = owner_id; // Set the owner_id
        newStore = await storeRepo.save(newStore);
        await this.populateProducts(newStore, collection);
        return newStore; // Return the newly created and saved store
    }

    async populateProducts(store: Store, collection: String): Promise<any> {
        let url = `http://localhost:9000/store/products?collection_id[]=${collection}`;

        try {
            const response = await axios.get(url);
            const products = response.data.products;
            return products.map((product) => product.id);
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
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
