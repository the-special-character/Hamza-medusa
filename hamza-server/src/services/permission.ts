import { TransactionBaseService } from '@medusajs/medusa';
import { Permission } from '../models/permission';
import PermissionRepository from '../repositories/permission';

export type CreatePayload = Pick<Permission, 'name' | 'metadata'>;

type InjectedDependencies = {
    permissionRepository: typeof PermissionRepository;
};
/**
 * @name PermissionService
 *
 * @description This creates a new permission in the database
 * at the moment we are using it to create permissions for vendors
 * ROLES;
 * `superAdmin` will have ALL permissions
 *  - Has complete control over ALL stores, including management of all users, products, orders, etc.
 * `vendorAdmin` will have limited permissions; they will act as vendors
 *  - Manages a specific store, including management of all specific vendor users, products, orders, etc.
 * `salesManager` will have limited permissions; they will act as sales managers
 *  - Sales data, generate reports, and view customer information
 *  `customerSupport` will have limited permissions; they will act as customer support
 *  - Access to order details, customer information, and can `resolve customer issues`
 * @author Garo Nazarian
 **/

class PermissionService extends TransactionBaseService {
    protected readonly permissionRepository_: typeof PermissionRepository;

    constructor(container: InjectedDependencies) {
        super(container);
        this.permissionRepository_ = container.permissionRepository;
    }

    async create(data: CreatePayload) {
        // omitting validation for simplicity
        return this.atomicPhase_(async (manager) => {
            const permissionRepo = manager.withRepository(
                this.permissionRepository_
            );
            const permission = permissionRepo.create(data);
            const result = await permissionRepo.save(permission);
            return result;
        });
    }

    // Simple implementation of a permission service (PoC)
    // We will implement a more complex permission system in the future
    async setupInitialRoles() {
        const existingPermissions = await this.permissionRepository_.find();
        if (existingPermissions.length === 0) {
            const roles = [
                { name: 'superAdmin', metadata: { canManageAll: true } },
                { name: 'vendorAdmin', metadata: { canManageStore: true } },
                { name: 'salesManager', metadata: { canViewSales: true } },
                {
                    name: 'customerSupport',
                    metadata: { canResolveIssues: true },
                },
            ];
            for (const role of roles) {
                await this.create({ name: role.name, metadata: role.metadata });
            }
        } else {
            return existingPermissions; // Optionally return existing roles or a message indicating no action was taken.
        }
    }
}

export default PermissionService;
