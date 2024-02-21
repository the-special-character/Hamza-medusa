import { Customer } from "@/models/customer";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const CustomerRepository = dataSource.getRepository(Customer).extend({
  async findByWalletAddress(wallet_address) {
    return this.findOne({
      where: { wallet_address },
    });
  },
});
