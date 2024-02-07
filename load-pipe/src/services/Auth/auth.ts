import { CustomerService } from "@medusajs/medusa";
import { Customer } from "@medusajs/medusa/dist/models/customer";
import { EventBusService } from "@medusajs/medusa/dist/services";
import { CustomerRepository } from "@medusajs/medusa/dist/repositories/customer";
import { AddressRepository } from "@medusajs/medusa/dist/repositories/address";
import { CreateCustomerInput } from "@medusajs/medusa/dist/types/customers";
import { EntityManager } from "typeorm";

type InjectedDependencies = {
  manager: EntityManager;
  eventBusService: EventBusService;
  customerRepository: typeof CustomerRepository;
  addressRepository: typeof AddressRepository;
};
class AuthService extends CustomerService {
  constructor(container: InjectedDependencies) {
    super(container);
  }

  // Example of overriding an existing method
  async create(customer: CreateCustomerInput): Promise<Customer> {
    // Custom logic before calling the base implementation
    console.log("Custom logic before creating a customer");

    // Call the base class method
    const createdCustomer = await super.create(customer);

    // Custom logic after the base method
    console.log("Custom logic after creating a customer");

    return createdCustomer;
  }

  // Implementing custom authentication method
  async customAuthMethod(
    email: string,
    password: string,
  ): Promise<Customer | null> {
    // Implement your authentication logic here
    // For example, find the customer by email
    const customer = await this.retrieveByEmail(email, {});

    if (!customer) {
      throw new Error("Customer not found");
    }

    // Here, you'd typically compare the provided password with the hashed password stored in the database
    // This is a simplified example
    if (password === "expectedPassword") {
      // Authentication successful
      return customer;
    } else {
      // Authentication failed
      return null;
    }
  }
}

export default AuthService;
