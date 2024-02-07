import { Column, Entity, Index } from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";

@Entity()
export class User extends MedusaUser {
  @Index("wallet_address")
  @Column({ nullable: false })
  wallet_address: string;

  @Column({ nullable: true })
  email?: string;
}
