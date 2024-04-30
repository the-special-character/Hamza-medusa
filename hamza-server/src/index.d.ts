// We're extending CORE Medusa models here

import { Store } from '@medusajs/medusa';
import { Role } from './models/role';
import { User } from './models/user';
import { Customer } from './models/customer';
import { Payment } from './models/payment';
import { Order } from './models/order';
import { Permission } from './models/permission';
import { Product } from './models/product';

// modifying the User model such that email is now optional
export declare module '@medusajs/medusa/dist/models/user' {
    interface User {
        wallet_address: string;
        email?: string;
        password_hash?: string;
        store?: Store;
        role_id: string | null;
        team_role: Role | null;
    }
}

export declare module '@medusajs/medusa/dist/models/customer' {
    interface Customer {
        wallet_address: string;
        email?: string;
        password_hash?: string;
    }
}

export declare module '@medusajs/medusa/dist/models/store' {
    interface Store {
        owner?: User;
        owner_id?: string;
        roles: Role[];
        name: string;
    }
}

export declare module '@medusajs/medusa/dist/models/product' {
    interface Product {
        store?: Store;
        store_id: string;
    }
}

export declare module '@medusajs/medusa/dist/models/payment' {
    interface Payment {
        transaction_id?: string;
        receiver_address?: string;
        payer_address?: string;
        escrow_contract_address?: string;
    }
}

export declare module '@medusajs/medusa/dist/models/order' {
    interface Order {
        store?: Store;
        store_id?: string;
        transaction_id?: string;
    }
}


