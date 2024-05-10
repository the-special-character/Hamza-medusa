import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseEntity, } from '@medusajs/medusa';
import { generateEntityId } from '@medusajs/medusa/dist/utils';
import { Customer } from './customer'

@Entity({ name: 'confirmation_token' })
export class ConfirmationToken extends BaseEntity {


    @Column()
    token: string

    @Column()
    email_address: string

    @Column({ default: false })
    redeemed: boolean;

    @Column({ default: 3 })
    expiration_hours: number


    @ManyToOne(() => Customer, customer => customer.walletAddresses, { nullable: false })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @Column({ type: 'varchar', name: 'customer_id' })
    customer_id: string;

    @BeforeInsert()
    private beforeInsert(): void {
        console.log('running generate entity id ', this.id, ' generated', generateEntityId(this.id, 'conf'))
        this.id = generateEntityId(this.id, 'conf');
    }
}