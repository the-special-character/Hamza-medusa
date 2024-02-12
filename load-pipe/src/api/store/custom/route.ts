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

export const POST = (req: MedusaRequest, res: MedusaResponse) => {
  res.json({
    message: "[POST] Hello world!",
  });
};
// s%3A9k7yoVAJFARexFBhpEWPf8qv7NUra0Zn.A7jbZdHZ%2FKukjyd6qf1rohdHgYfUmLcwJle9epE8cn4
