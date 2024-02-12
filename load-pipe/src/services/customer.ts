import { CustomerService as DefaultCustomerService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import { TransactionBaseService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import jwt from "jsonwebtoken";
class CustomerService extends DefaultCustomerService {
  // ...
  // We can just use the default repository from our customer entity

  getMessage() {
    return `Welcome to the customer init page!`;
  }
}

export default CustomerService;
