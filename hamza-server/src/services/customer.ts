import {CustomerService as MedusaCustomerService } from "@medusajs/medusa";
import {Customer} from "../models/customer";
import {CreateCustomerInput, UpdateCustomerInput} from "@medusajs/medusa/dist/types/customers";
import {Lifetime} from "awilix"
import { CustomerRepository } from "../repositories/customer";

interface CustomCustomerInput extends CreateCustomerInput {
  wallet_address: string;
}

export default class CustomerService extends MedusaCustomerService {
  static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

  protected customerRepository_: typeof CustomerRepository;

  constructor(container) {
    super(container);
    this.customerRepository_ = container.customerRepository;
  }

  async create(input: CustomCustomerInput): Promise<Customer> {
    console.log("CustomerService.create() method running with input;", input)
    const existingCustomer = await this.customerRepository_.findByWalletAddress(input.wallet_address);

    if (existingCustomer) {
      console.log(`Customer with wallet address ${input.wallet_address} already exists`);
      return existingCustomer
    }
    console.log(`creating Customer with input ${JSON.stringify(input)}`);
    try {
      const _customer = await super.create(input);
      console.log(`Extending Customer with wallet address: ${_customer.wallet_address}`);
      return _customer;
    } catch (e) {
      console.log(`Error creating customer: ${e}`);
    }
    // lets add a try catch for actually creating a customer?
  }
}

