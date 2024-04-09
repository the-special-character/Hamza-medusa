import { AdminPostProductsReq as MedusaAdminPostProductsReq } from "@medusajs/medusa/dist/api/routes/admin/products/create-product";
import { IsString } from "class-validator";

export class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsString()
  custom_field: string;
}
