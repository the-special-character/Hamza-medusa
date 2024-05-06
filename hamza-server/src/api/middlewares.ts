import type {
    MiddlewaresConfig,
    User,
    UserService,
    MedusaNextFunction,
    MedusaRequest,
    MedusaResponse,
} from '@medusajs/medusa';
import cors from 'cors';

const storeAccessControl = async (req, res, next) => {
    if (!req.user || !req.user.userId) {
        res.sendStatus(401);
        return;
    }

    const userService = req.scope.resolve('userService') as UserService;
    const loggedInUser = await userService.retrieve(req.user.userId, {
        relations: ['role', 'role.store'], // Ensure 'role.store' is correctly populated
    });

    const requestStoreId = req.params.store_id; // Adjust based on how store_id is passed in your requests

    if (loggedInUser.role_id === requestStoreId) {
        next();
    } else {
        res.status(403).send(
            'Access denied: You do not have access to this store’s data'
        );
        return;
    }
};

const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';
const ADMIN_CORS =
    process.env.ADMIN_CORS || 'http://localhost:7001;http://localhost:7000';
const registerLoggedInUser = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    let loggedInUser: User | null = null;

    if (req.user && req.user.userId) {
        const userService = req.scope.resolve('userService') as UserService;
        loggedInUser = await userService.retrieve(req.user.userId);
    }

    req.scope.register({
        loggedInUser: {
            resolve: () => loggedInUser,
        },
    });

    next();
};

export const permissions = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    if (!req.user || !req.user.userId) {
        next();
        return;
    }
    // retrieve currently logged-in user
    const userService = req.scope.resolve('userService') as UserService;
    const loggedInUser = await userService.retrieve(req.user.userId, {
        select: ['id'],
        relations: ['team_role', 'team_role.permissions'],
    });

    if (!loggedInUser.team_role) {
        // considered as super user
        next();
        return;
    }

    const isAllowed = loggedInUser.team_role?.permissions.some((permission) => {
        const metadataKey = Object.keys(permission.metadata).find(
            (key) => key === req.path
        );
        if (!metadataKey) {
            return false;
        }

        // boolean value
        return permission.metadata[metadataKey];
    });

    if (isAllowed) {
        next();
        return;
    }

    // deny access
    res.sendStatus(401);
};

export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: '/admin/products',
            middlewares: [registerLoggedInUser],
        },
        {
            matcher: '/admin/auth',
            middlewares: [
                cors({
                    origin: [
                        STORE_CORS,
                        'http://localhost:7001',
                        'http://localhost:7000',
                    ],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/collections',
            middlewares: [
                cors({
                    origin: [STORE_CORS],
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/*',
            middlewares: [
                cors({
                    origin: [
                        'http://localhost:7001',
                        'http://localhost:7000',
                        STORE_CORS,
                    ],
                    credentials: true,
                }),
                [permissions],
            ],
        },
        {
            matcher: '/custom/*',
            middlewares: [
                cors({
                    origin: '*',
                    credentials: true,
                }),
            ],
        },
        {
            matcher: '/admin/currencies',
            middlewares: [
                cors({
                    origin: '*',
                    credentials: true,
                }),
            ],
        },
    ],
};
