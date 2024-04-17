import type {
    MedusaRequest,
    MedusaResponse,
    ProductService,
} from '@medusajs/medusa';
import { ProductSelector as MedusaProductSelector } from '@medusajs/medusa/dist/types/product';
import StoreService from '../../../../services/store';

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

        // //get product service
        // const productService: ProductService =
        //     req.scope.resolve('productService');
        //
        // //validate request
        //
        // //select products by store
        // const selector: ProductSelector = {
        //     store_id: req.query.store_id.toString(),
        // };
        // const products = await productService.list(selector);

        //return results
        return res.json({ store });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
