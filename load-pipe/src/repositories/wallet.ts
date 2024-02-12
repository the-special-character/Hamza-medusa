import { Customer } from "../models/customer";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

// TODO: Implement a customMethod; if(wallet_address) break else: create user with new wallet_address

export const WalletRepository = dataSource.getRepository(Customer).extend({
  async createCustomer(wallet_address: string): Promise<Customer | string> {
    // Check if the wallet_address exists
    const existingCustomer = await this.findOne({ where: { wallet_address } });

    // If the wallet_address exists, return string "Wallet Address already exists"
    if (existingCustomer) {
      console.log("Customer with this wallet address already exists.");
      return null; // or throw new Error("Customer with this wallet address already exists.");
    }

    // If no customer exists with the wallet_address, create a new customer
    const newCustomer = new Customer();
    newCustomer.wallet_address = wallet_address;
    // Set other required fields on newCustomer as needed

    // Save the new customer to the database
    await this.save(newCustomer);

    // Return the newly created customer
    return newCustomer;
  },
});
