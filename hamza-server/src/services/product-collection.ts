import { Lifetime } from 'awilix';
import {
    ProductCollection,
    ProductCollectionService as MedusaProductCollectionService,
} from '@medusajs/medusa';
import {
    CreateProductCollection,
    UpdateProductCollection,
} from '@medusajs/medusa/dist/types/product-collection';

class ProductCollectionService extends MedusaProductCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;

    constructor(container) {
        super(container);
    }

    async update(
        id: string,
        input: UpdateProductCollection
    ): Promise<ProductCollection> {
        console.log('updating product collection', id, input);
        return super.update(id, input);
    }

    async create(input: CreateProductCollection): Promise<ProductCollection> {
        console.log('creating product collection', input);
        return super.create(input);
    }
}

export default ProductCollectionService;
