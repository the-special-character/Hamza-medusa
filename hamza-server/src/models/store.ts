import { Entity, OneToOne, JoinColumn, Column } from 'typeorm';
import { Store as MedusaStore } from '@medusajs/medusa';
import { User } from './user';

@Entity()
export class Store extends MedusaStore {
    @OneToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    owner?: User;

    @Column('owner_id')
    owner_id?: string;
}
