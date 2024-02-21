export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    customAttribute: string;
  }
}

// modifying the User model such that email is now optional
export declare module "@medusajs/medusa/dist/models/user" {
  declare interface User {
    wallet_address: string;
    email?: string;
    password_hash?: string;
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    wallet_address: string;
    email?: string;
    password_hash?: string;
  }
}
