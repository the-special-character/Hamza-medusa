import type {
    MedusaRequest,
    MedusaResponse,
    ProductService,
} from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';

type ProductSelector = {
    store_id?: string;
} & MedusaProductSelector;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        //get product service
        const productService: ProductService =
            req.scope.resolve('productService');

        //validate request
        if (!req.query.store_id || !req.query.store_id.length)
            return res.status(400).json({ message: 'Missing store_id' });

        //select products by store
        const selector: ProductSelector = {
            store_id: req.query.store_id.toString(),
        };
        const products = await productService.list(selector);

        //return results
        return res.json({ products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
