import { Column, Entity } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa";

@Entity()
export class Product extends MedusaProduct {
  @Column({ nullable: false, default: "" })
  store_id: string;

  // @Column({ nullable: true })
  // email?: string;
  // wallet_address?: string;
}
