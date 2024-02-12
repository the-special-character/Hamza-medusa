// https://docs.medusajs.com/development/api-routes/extend-validator
import { registerOverriddenValidators } from "@medusajs/medusa";
import { IsString } from "class-validator";

// TODO: Creating our own StorePostCustomersReq and calling it StorePostCustomersReqCustom, this way we can call it to the frontend and not run into issues...

declare const _default: (req: any, res: any) => Promise<void>;
export default _default;
/**
 * @schema StorePostCustomersReq
 * type: object
 * description: "The details of the customer to create."
 * required:
 *   - wallet_address
 * optional:
 *   - first_name
 *   - last_name
 *   - email
 *   - password
 * properties:
 *   wallet_address:
 *     description: "Wallet Address derived from metamask wallet."
 *     type: string
 *   first_name:
 *     description: "The customer's first name."
 *     type: string
 *   last_name:
 *     description: "The customer's last name."
 *     type: string
 *   email:
 *     description: "The customer's email."
 *     type: string
 *     format: email
 *   password:
 *     description: "The customer's password."
 *     type: string
 *     format: password
 *   phone:
 *     description: "The customer's phone number."
 *     type: string
 */

class StorePostCustomersReqCustom {
  wallet_address: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  phone?: string;
}
