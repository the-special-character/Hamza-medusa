import { CustomerService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { Customer } from "../models";
import { EventBusService } from "../services";
import { CustomerRepository, AddressRepository } from "../repositories";
import { CreateCustomerInput } from "../types/customers";

type AuthServiceDependencies = {
  manager: EntityManager;
  eventBusService: EventBusService;
  customerRepository: typeof CustomerRepository;
  addressRepository: typeof AddressRepository;
};

class AuthService extends CustomerService {
  constructor({
    manager,
    eventBusService,
    customerRepository,
    addressRepository,
  }: AuthServiceDependencies) {
    super({ manager, eventBusService, customerRepository, addressRepository });
  }

  /**
   * Authenticate a customer using their wallet public address and nonce.
   * @param publicAddress - The public address of the customer's wallet.
   * @param nonce - The nonce used for authentication.
   * @param signature - The signature proving ownership of the wallet.
   * @returns The authenticated customer or creates a new one if not exists.
   */
  async authenticateWithWallet(
    publicAddress: string,
    nonce: string,
    signature: string,
  ): Promise<Customer> {
    // Verify the signature with the nonce and publicAddress here.
    // This is where you'd integrate your wallet signature verification logic.

    // Check if a customer with the given public address already exists.
    let customer = await this.customerRepository_.findOne({
      where: { publicAddress },
    });

    // If the customer doesn't exist, create a new one.
    if (!customer) {
      const customerData: CreateCustomerInput = {
        // Populate the customer data a1s needed.
        // Since email is optional in your setup, you might not set it here.
        publicAddress,
      };
      customer = await this.create(customerData);
    }

    // Return the authenticated or newly created customer.
    return customer;
  }

  // Override or add additional methods as needed for your auth flow.
}

export default AuthService;
