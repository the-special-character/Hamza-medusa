import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa"
import {SiweMessage} from "siwe";
// Using Auth from SIWE example: https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js

// TODO: So once the user has been verified, we can use the CustomerService.create() method to create/login the user.

export const POST = async(
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const customerService = req.scope.resolve("customerService");
  const { message, signature } = req.body;
  const public_wallet_address = message.address;
  console.log("typeof wallet address", typeof public_wallet_address, public_wallet_address);

  const dummyCustomerData = {
    "email": "testuser@gmail.com",
    "first_name": "g",
    "last_name": "t",
    "password": "toor",
    "wallet_address": public_wallet_address
  }

  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.verify({ signature });
    // If the signature is verified, we can create the user.
    await customerService.create(dummyCustomerData);
    res.send(true);
  } catch {
    res.send(false);
  }
}