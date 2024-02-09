// https://docs.medusajs.com/development/api-routes/extend-validator
import { registerOverriddenValidators } from "@medusajs/medusa";
import { AdminPostAuthReq as MedusaAdminAuthReq } from "@medusajs/medusa";
import { IsString } from "class-validator";

class AdminAuth extends MedusaAdminAuthReq {
  @IsString()
  custom_field: string;
}

registerOverriddenValidators(AdminAuth);
