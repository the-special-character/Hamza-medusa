interface Product {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
}

export interface WishlistItem {
    id: string;
    created_at: string;
    updated_at: string;
    wishlist_id: string;
    product_id: string;
    product: Product;
}
