import { Column, Entity, Index } from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";

@Entity()
export class User extends MedusaUser {
  @Column({ nullable: false, default: "" })
  wallet_address: string;

  @Column({ nullable: true })
  email?: string;
}
