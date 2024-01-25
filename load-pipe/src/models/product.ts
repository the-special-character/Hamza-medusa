// TODO: replace with actual data after it displays in the admin UI https://docs.medusajs.com/development/entities/extend-entity
import { Column, Entity } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa";

@Entity()
export class Product extends MedusaProduct {
  @Column()
  customAttribute: string;
}
