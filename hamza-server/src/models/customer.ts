import { Column, Entity } from 'typeorm';
import {
    // alias the core entity to not cause a naming conflict
    Customer as MedusaCustomer,
} from '@medusajs/medusa';

@Entity()
export class Customer extends MedusaCustomer {
    @Column({ nullable: false, default: '' })
    wallet_address: string;

    // @Column({ nullable: true })
    // email?: string;
}
