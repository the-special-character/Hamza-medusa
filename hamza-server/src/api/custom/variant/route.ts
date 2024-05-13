import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import ProductVariantService from '../../../services/product-variant';
import { readRequestBody } from '../../../utils/request-body';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const productVariantService: ProductVariantService = req.scope.resolve(
        'productVariantService'
    );
    const { variant_id } = readRequestBody(req.body, ['variant_id']);

    try {
        const updatedVariant =
            await productVariantService.updateInventory(variant_id);
        res.json(updatedVariant);
    } catch (err) {
        console.error('Error updating variant:', err);
        res.status(500).json({
            error: 'Failed to update variant',
        });
    }
};
