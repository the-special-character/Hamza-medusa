import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const userService = req.scope.resolve('userService');
        const role = await userService.update(req.body.user_id, {
            role_id: req.body.role_id,
        });
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
