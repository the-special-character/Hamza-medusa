import { ProductVariantService as MedusaProductVariantService } from '@medusajs/medusa';
import { ProductVariant } from '@medusajs/medusa';
import { Lifetime } from 'awilix';
import { ProductVariantRepository } from '../repositories/product-variant';

class ProductVariantService extends MedusaProductVariantService {
    static LIFE_TIME = Lifetime.SCOPED;
    protected readonly productVariantRepository_: typeof ProductVariantRepository;

    constructor(container) {
        super(container);
        this.productVariantRepository_ = container.productVariantRepository;
    }

    async updateInventory(variantOrVariantId: string) {
        try {
            const productVariant = await this.productVariantRepository_.findOne(
                {
                    where: { id: variantOrVariantId },
                }
            );
            console.log(`Updating inventory for variant ${productVariant.id}`);
        } catch (e) {
            console.log(
                `Error updating inventory for variant ${variantOrVariantId}`
            );
        }
    }
}

export default ProductVariantService;
