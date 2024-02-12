import { CustomerService } from "@medusajs/medusa";
import { Customer } from "../models/customer";

class WalletService extends CustomerService {
  // ...
  // We can just use the default repository from our customer entity

  getMessage() {
    return `Welcome to the customer init page!`;
  }
}

export default WalletService;
