import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
    Currency,
    // alias the core entity to not cause a naming conflict
    Customer as MedusaCustomer,
} from '@medusajs/medusa';

@Entity()
export class Customer extends MedusaCustomer {
    @Column({ nullable: false, default: '' })
    wallet_address: string;

    // @Column({ nullable: true })
    // email?: string;

    @ManyToOne((type) => Currency, { nullable: true })
    @JoinColumn({ name: 'preferred_currency_id' })
    preferred_currency?: Currency

    @Column('preferred_currency_id')
    preferred_currency_id?: string

    @BeforeInsert()
    private assignRandomCurrency() {
        const currencies = ['eth', 'usdt', 'usdc'];
        // Randomly pick a currency ID
        this.preferred_currency_id = currencies[Math.floor(Math.random() * currencies.length)];
    }
}
