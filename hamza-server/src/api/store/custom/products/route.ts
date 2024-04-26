import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../services/store';
import ProductService from '../../../../services/product';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        //get store by name
        const storeService: StoreService = req.scope.resolve('storeService');
        if (!req.query.store_name || !req.query.store_name.length)
            return res.status(400).json({ message: 'Missing store_name' });

        const store = await storeService.getStoreByName(
            req.query.store_name.toString()
        );

        // Simple error handing
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Chain query to get products
        const productService: ProductService =
            req.scope.resolve('productService');

        const list_products =
            await productService.getProductsFromStoreWithPrices(store.id);
        return res.json(list_products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
