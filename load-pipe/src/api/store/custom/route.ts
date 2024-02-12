import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { CustomerRepository } from "../../../repositories/customer";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const customerRepository: typeof CustomerRepository =
    req.scope.resolve("customerRepository");
  const manager: EntityManager = req.scope.resolve("manager");
  const customerRepo = manager.withRepository(customerRepository);

  return res.json({
    posts: await customerRepo.find(),
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  const customerRepository = req.scope.resolve("customerRepository");

  try {
    const customer = await customerRepository.createCustomer(
      wallet_address.toString(),
    );

    if (!customer) {
      return res
        .status(409)
        .json({ message: "Customer with this wallet address already exists." });
    }

    return res.status(201).json({ customer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// s%3A9k7yoVAJFARexFBhpEWPf8qv7NUra0Zn.A7jbZdHZ%2FKukjyd6qf1rohdHgYfUmLcwJle9epE8cn4
