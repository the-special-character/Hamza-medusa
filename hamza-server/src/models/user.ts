import {
    Column,
  Entity,
  OneToOne,
} from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";
import { WalletAddress } from "./walletAddress";
import { Store } from "./store";
// For a simple solution, we're not going to extend (User Entity roles) from Medusa's User Entity
// `admin` will have all permissions
// `member` will have limited permissions; they will act as vendors
// Vendors will only have access to their own products
// TODO: https://docs.medusajs.com/modules/users/backend/rbac
@Entity()
export class User extends MedusaUser {
  // @OneToMany(() => WalletAddress, walletAddress => walletAddress.user)
  // walletAddresses?: WalletAddress[];

  @OneToOne(() => Store, (store) => store.owner)
  store?: Store;

  @Column()
  wallet_address: string;
  // email?: string;
  // password_hash?: string;
}
