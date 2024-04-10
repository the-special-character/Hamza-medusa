import { Lifetime } from "awilix"
import { 
  FindConfig,
  StoreService as MedusaStoreService, Store
} from "@medusajs/medusa"
import { User } from "../models/user"
import StoreRepository from "../repositories/store"


class StoreService extends MedusaStoreService {
  static LIFE_TIME = Lifetime.SCOPED
  protected readonly storeRepository_: typeof StoreRepository

  constructor(container, options) {
    // @ts-expect-error prefer-rest-params
    super(...arguments)
    this.storeRepository_ = container.storeRepository
  }

  async addUser(
    user: User
  ): Promise<Store> {
    const storeRepo = this.manager_.withRepository(
      this.storeRepository_
    )
    let newStore = storeRepo.create()
    newStore = await storeRepo.save(newStore)
    newStore.owner = user

    return newStore
  }


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

export default StoreService