import { Customer } from "../models/customer";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const WalletRepository = dataSource.getRepository(Customer).extend({
  customMethod(): void {},
});
