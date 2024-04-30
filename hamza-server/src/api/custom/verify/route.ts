import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { SiweMessage } from 'siwe';
import CustomerService from 'src/services/customer';
// Using Auth from SIWE example: https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js

// TODO: So once the user has been verified, we can use the CustomerService.create() method to create/login the user.

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const customerService: CustomerService = req.scope.resolve('customerService');
    const { message, signature } = req.body;
    const wallet_address = message.address;

    //create customer input data
    const customerInputData = {
        email: `${wallet_address}@evm.blockchain`,
        first_name:
            wallet_address.length >= 10
                ? wallet_address.substring(0, 10)
                : wallet_address,
        last_name:
            wallet_address.length > 10
                ? wallet_address.substring(10)
                : wallet_address,
        password: 'password', //TODO: (JK) store the default password someplace
        wallet_address: wallet_address,
    };

    //send the requests to server
    const siweMessage = new SiweMessage(message);
    try {
        await siweMessage.verify({ signature });
        // If the signature is verified, we can create the user.
        const customer = await customerService.create(customerInputData);

        let body = {
            customer_id: customer.id,
            preferred_currency: customer.preferred_currency,
            bool_resp: true,
        };
        res.send(body);
    } catch {
        res.send(false);
    }
};
