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

export default class ProductCollectionService extends MedusaProductCollectionService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productCollectionRepository_: typeof ProductCollectionRepository;

    constructor(container) {
        super(container);
        console.log('CREATERD PRODUCT COLLECTION SERVICCE');
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

    async addProducts(
        collection_id: string,
        product_ids: string[]
    ): Promise<ProductCollection> {
        //TODO: check each product's store_id, make sure that it matches the collection's

        await super.addProducts(collection_id, product_ids);
        return await this.productCollectionRepository_.findOne({
            where: { id: collection_id },
        });
    }
}
