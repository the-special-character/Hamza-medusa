import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import { SiweMessage } from 'siwe';
import CustomerRepository from '../../../repositories/customer';
import AuthService from '../../../../src/services/auth';
import CustomerService from '../../../../src/services/customer';
import { readRequestBody } from '../../../utils/request-body';
import CustomerWalletAddressRepository from '../../../repositories/customer-wallet-address';
import { Customer } from 'src/models/customer';
// Using Auth from SIWE example: https://github.com/spruceid/siwe-quickstart/blob/main/02_backend/src/index.js

// TODO: So once the user has been verified, we can use the CustomerService.create() method to create/login the user.

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    try {
        const customerService: CustomerService =
            req.scope.resolve('customerService');
        const authService: AuthService = req.scope.resolve('authService');

        const { message, signature } = readRequestBody(req.body, [
            'message',
            'signature',
        ]);

        const wallet_address = message.address;

        let checkCustomerWithWalletAddress =
            await CustomerWalletAddressRepository.findOne({
                where: { wallet_address: wallet_address },
                relations: { customer: { preferred_currency: true } },
            });

        //create customer input data
        const customerInputData = {
            email: `${checkCustomerWithWalletAddress && checkCustomerWithWalletAddress.customer ? checkCustomerWithWalletAddress.customer.email : `${wallet_address}@evm.blockchain`}`,
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
        console.log('siwe response is ', siweResponse);
        if (!siweResponse.success) {
            throw new Error('Error in validating wallet address signature');
        }

        console.log('customer data is ', checkCustomerWithWalletAddress);
        let newCustomerData: Customer;
        if (!checkCustomerWithWalletAddress) {
            console.log('creating new customer ');
            await customerService.create(customerInputData);
            newCustomerData = await CustomerRepository.findOne({
                where: { email: customerInputData.email.toLowerCase() },
                relations: { preferred_currency: true },
            });
        }
        let authResult = await authService.authenticateCustomer(
            customerInputData.email.toLowerCase(),
            customerInputData.password,
            customerInputData.wallet_address
        );
        console.log('auth result is ', authResult);
        if (!authResult.success) {
            throw new Error('Error in verifying email and password');
        }

        let body = {
            customer_id:
                checkCustomerWithWalletAddress &&
                checkCustomerWithWalletAddress.customer &&
                checkCustomerWithWalletAddress.customer.id,
            preferred_currency:
                checkCustomerWithWalletAddress &&
                checkCustomerWithWalletAddress.customer &&
                checkCustomerWithWalletAddress.customer.preferred_currency,
            email: customerInputData.email,
        };
        res.send({ status: true, data: body });
    } catch (e) {
        console.log('error in verifying user login ', e);
        res.send({ status: false, message: e.message });
    }
};
