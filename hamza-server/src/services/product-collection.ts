import { Lifetime } from 'awilix';
import { ProductCollectionService as MedusaProductCollectionService } from '@medusajs/medusa';
import {
    CreateProductCollection as MedusaCreateProductCollection,
    UpdateProductCollection as MedusaUpdateProductCollection,
} from '@medusajs/medusa/dist/types/product-collection';
import { ProductCollection } from '../models/product-collection';
import { ProductCollectionRepository } from '../repositories/product-collection';
import { UpdateResult } from 'typeorm';

type UpdateProductCollection = MedusaUpdateProductCollection & {
    store_id?: string;
};

type CreateProductCollection = MedusaCreateProductCollection & {
    store_id?: string;
};

class ProductCollectionService extends MedusaProductCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productCollectionRepository_: typeof ProductCollectionRepository;

    constructor(container) {
        super(container);
        this.productCollectionRepository_ =
            container.productCollectionRepository;
    }

    async update(
        id: string,
        input: UpdateProductCollection
    ): Promise<ProductCollection> {
        console.log('updating product collection', id, input);
        const result: UpdateResult =
            await this.productCollectionRepository_.update(id, input);
        return await this.productCollectionRepository_.findOne({
            where: { id },
        });
    }

    async create(input: CreateProductCollection): Promise<ProductCollection> {
        console.log('creating product collection', input);
        return await this.productCollectionRepository_.create(input);
    }
}

export default ProductCollectionService;
