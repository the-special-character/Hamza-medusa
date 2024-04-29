export interface ProductType {
    id: string;
    title: string;
    handle: string;
    thumbnail: string;
}

export interface WishlistType {
    id: string;
    wishlist_id: string;
    product_id: string;
    product: ProductType;
}
