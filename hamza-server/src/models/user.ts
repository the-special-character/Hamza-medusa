import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { User as MedusaUser } from '@medusajs/medusa';
import { WalletAddress } from './walletAddress';
import { Store } from './store';
import { Role } from './role';
// For a simple solution, we're not going to extend (User Entity roles) from Medusa's User Entity
// `admin` will have all permissions
// `member` will have limited permissions; they will act as vendors
// Vendors will only have access to their own products

@Entity()
export class User extends MedusaUser {
    // @OneToMany(() => WalletAddress, walletAddress => walletAddress.user)
    // walletAddresses?: WalletAddress[];
    @Index()
    @Column({ nullable: true })
    role_id: string | null;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    team_role: Role | null;

    @OneToOne(() => Store, (store) => store.owner)
    store?: Store;

    @Column()
    wallet_address: string;
    // email?: string;
    // password_hash?: string;
}
