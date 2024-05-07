import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { SiweMessage } from 'siwe';
import CustomerRepository from '../../../repositories/customer';
import AuthService from 'src/services/auth';
import CustomerService from 'src/services/customer';
// Using Auth from SIWE example: https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js

// TODO: So once the user has been verified, we can use the CustomerService.create() method to create/login the user.

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const customerService: CustomerService = req.scope.resolve('customerService');
        const authService: AuthService = req.scope.resolve("authService")
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
        console.log('customer input is ', customerInputData);
        //send the requests to server
        const siweMessage = new SiweMessage(message);
        let siweResponse = await siweMessage.verify({ signature });
        console.log('siwe response is ', siweResponse)
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature')
        }

        let customerData = await CustomerRepository.findOne({ where: { email: customerInputData.email.toLowerCase() }, relations: { preferred_currency: true } });
        console.log('customer data is ', customerData)

        if (!customerData) {
            console.log('creating new customer ')
            await customerService.create(customerInputData);
            customerData = await CustomerRepository.findOne({ where: { email: customerInputData.email.toLowerCase() }, relations: { preferred_currency: true } });
        }
        let authResult = await authService.authenticateCustomer(customerInputData.email.toLowerCase(), customerInputData.password, customerInputData.wallet_address);
        console.log('auth result is ', authResult)
        if (!authResult.success) {
            throw new Error('Error in verifying email and password')
        }

        console.log('customer data is ', customerData)
        let body = {
            customer_id: customerData.id,
            preferred_currency: customerData.preferred_currency,
        };
        res.send({ status: true, data: body });

    } catch (e) {
        console.log('error in verifying user login ', e);
        res.send({ status: false, message: e.message });
    }

};
