import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const userService = req.scope.resolve('userService');
    const storeService = req.scope.resolve('storeService');

    try {
        const user0 = await userService.create(
            {
                email: 'GoblinVendor@hamza.com',
                first_name: 'Goblin',
                last_name: 'Vendor',
                wallet_address: '0x1234567890',
            },
            'password'
        );

        const user1 = await userService.create(
            {
                email: 'QualityVendor@hamza.com',
                first_name: 'Quality',
                last_name: 'Vendor',
                wallet_address: '0x1234567891',
            },
            'password'
        );

        const user2 = await userService.create(
            {
                email: 'HeadphonesVendor@hamza.com',
                first_name: 'Headphones',
                last_name: 'Vendor',
                wallet_address: '0x1234567892',
            },
            'password'
        );

        const store0 = await storeService.createStore(
            user0,
            'Goblin Store',
            'pcol_01HRVF8HCVY8B00RF5S54THTPC'
        );
        const store1 = await storeService.createStore(
            user1,
            'Quality Store',
            'pcol_01HSGAM4918EX0DETKY6E662WT'
        );
        const store2 = await storeService.createStore(
            user2,
            'Headphones Store',
            'pcol_01HSGAMXDJD725MR3VSW631SN2'
        );

        return res.json({ user0, user1, user2, store0, store1, store2 });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ message: 'Internal server error', error: error.message });
    }
};
