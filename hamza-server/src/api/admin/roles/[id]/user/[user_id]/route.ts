import type { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import RoleService from '../../../../../../services/role';

// TODO: We can move this to our service layer to keep our route clean,
//  we already have a service layer to create users this can easily be added there
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    // omitting validation for simplicity purposes
    const { id, user_id } = req.params;

    const roleService = req.scope.resolve('roleService') as RoleService;
    const role = await roleService.associateUser(id, user_id);

    res.json(role);
};
