import { TransactionBaseService } from "@medusajs/medusa";
import { Customer } from "../models/customer";
import { Lifetime } from "awilix";
import { CustomerRepository } from "../repositories/customer";
import jwt from "jsonwebtoken";
import { ethers } from "ethers";
import crypto from "crypto";
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

  // Generate a Nonce
  async generateNonce(): Promise<string> {
    return crypto.randomBytes(16).toString("hex");
  }
  async verifyWalletSignature(
    wallet_address: string,
    signature: string,
    message: string,
  ): Promise<boolean> {
    // Verify signature
    try {
      const signerAddress = ethers.verifyMessage(message, signature);
      if (signerAddress.toLowerCase() === wallet_address.toLowerCase()) {
        return true;
      }
    } catch (e) {
      console.log(e);
      // return status 401 if signature verification fails
      return false;
    }
  }
}

export default CustomerService;
