import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { WalletRepository } from "../../../repositories/wallet";
import { EntityManager } from "typeorm";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const walletRepository: typeof WalletRepository =
    req.scope.resolve("walletRepository");
  const manager: EntityManager = req.scope.resolve("manager");
  const customerRepo = manager.withRepository(walletRepository);

  return res.json({
    posts: await customerRepo.find(),
  });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { wallet_address } = req.body;

  if (!wallet_address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  const walletRepository = req.scope.resolve("walletRepository");

  try {
    const customer = await walletRepository.createCustomer(
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

// TODO: Next step is to create a POST, such that all I need to do is input the wallet_address, and it will create a user.

// s%3A9k7yoVAJFARexFBhpEWPf8qv7NUra0Zn.A7jbZdHZ%2FKukjyd6qf1rohdHgYfUmLcwJle9epE8cn4
