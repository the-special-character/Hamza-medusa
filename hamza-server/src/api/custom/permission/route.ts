import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const permissionService = req.scope.resolve('permissionService');
        const permissions = await permissionService.setupInitialRoles();
        res.json({
            success: true,
            message: 'Roles setup successfully',
            permissions,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
