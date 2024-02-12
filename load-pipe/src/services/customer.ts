import { TransactionBaseService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import { Lifetime } from "awilix";
import { CustomerRepository } from "../repositories/customer";
import jwt from "jsonwebtoken";
class CustomerService extends TransactionBaseService {
  static Events: {
    CREATED: string;
    UPDATED: string;
  };

  protected customerRepository_: typeof CustomerRepository;

  // Custom repository's are registered to depencency injection container
  // They can be accessed through resources, such as services, through dependency injection.
  // eg, we will access the customerRepository in our constructor below: https://docs.medusajs.com/development/entities/repositories#services

  constructor({ customerRepository }) {
    super(customerRepository);
    this.customerRepository_ = customerRepository;
  }

  async createCustomer(wallet_address: string): Promise<Customer | null> {
    const existingCustomer = await this.customerRepository_.findOne({
      where: { wallet_address },
    });

    if (existingCustomer) {
      return null;
    }

    const newCustomer = new Customer();
    newCustomer.wallet_address = wallet_address;
    await this.customerRepository_.save(newCustomer);

    // Emit an event if necessary, e.g., this.emit(CustomerService.Events.CREATED, { customer: newCustomer });

    return newCustomer;
  }

  async findAllCustomers() {
    return await this.customerRepository_.find();
  }

  getMessage() {
    return `Welcome to the customer init page!`;
  }
}

export default CustomerService;
