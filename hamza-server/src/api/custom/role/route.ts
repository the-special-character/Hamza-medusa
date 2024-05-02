import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const roleService = req.scope.resolve('roleService');
        const role = await roleService.setupInitialRoles();
        res.json({
            success: true,
            message: 'Roles setup successfully',
            role,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};
