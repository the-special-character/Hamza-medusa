// DOCS: https://docs.medusajs.com/development/api-routes/extend-validator
// Creating extended validators to add new properties

import { registerOverriddenValidators } from "@medusajs/medusa";
import { registerExtendedValidator } from "../utils/extending-validator";
import { StorePostAuthReq as MedusaStorePostAuthReq } from "@medusajs/medusa/dist/api/routes/store/auth";
import { IsEnum, IsString } from "class-validator";
import { AdminPostProductsReq } from "./routes/products/create-product";

export class StorePostAuthReq extends MedusaStorePostAuthReq {
  @IsString()
  wallet_address: string;
}

registerOverriddenValidators(StorePostAuthReq);

export default async function () {
  await registerExtendedValidator(AdminPostProductsReq);
}
