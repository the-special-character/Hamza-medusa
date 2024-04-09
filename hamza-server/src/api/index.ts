// DOCS: https://docs.medusajs.com/development/api-routes/extend-validator
// Creating extended validators to add new properties

import { registerOverriddenValidators } from "@medusajs/medusa";
import { StorePostAuthReq as MedusaStorePostAuthReq } from "@medusajs/medusa/dist/api/routes/store/auth";
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { IsEnum, IsString } from "class-validator";

export class StorePostAuthReq extends MedusaStorePostAuthReq {
  @IsString()
  wallet_address: string;
}

export class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsString()
  store_id: string;
}

// registerOverriddenValidators(StorePostAuthReq);
registerOverriddenValidators(AdminPostProductsReq);
