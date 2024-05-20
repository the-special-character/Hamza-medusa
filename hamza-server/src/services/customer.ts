import { CustomerService as MedusaCustomerService } from '@medusajs/medusa';
import { CreateCustomerInput } from '@medusajs/medusa/dist/types/customers';
import { Lifetime } from 'awilix';
import { CustomerRepository } from '../repositories/customer';
import CustomerWalletAddressRepository from '../repositories/customer-wallet-address';

interface CustomCustomerInput extends CreateCustomerInput {
    wallet_address?: string;
}

export default class CustomerService extends MedusaCustomerService {
    static LIFE_TIME = Lifetime.SINGLETON; // default, but just to show how to change it

    protected customerRepository_: typeof CustomerRepository;

    constructor(container) {
        super(container);
        this.customerRepository_ = container.customerRepository;
    }

    async create(input: CustomCustomerInput): Promise<any> {
        // let existingWalletAddress =
        //     await CustomerWalletAddressRepository.findOne({
        //         where: { wallet_address: input.wallet_address },
        //         relations: { customer: { preferred_currency: true } },
        //         select: { wallet_address: true },
        //     });

        // if (existingWalletAddress) {
        //     console.log(
        //         `Customer with wallet address ${input.wallet_address} already exists`
        //     );
        //     return {
        //         customer: existingWalletAddress.customer,
        //         customerWalletAddress: existingWalletAddress,
        //         customerPreferredCurrency:
        //             existingWalletAddress.customer.preferred_currency,
        //     };
        // } else {
        //     console.log(
        //         `Customer with wallet address ${input.wallet_address} not found`
        //     );
        // }
        console.log(`creating Customer with input ${JSON.stringify(input)}`);
        try {
            const { wallet_address, ...rest } = input;
            const _customer: any = await super.create(rest);
            // const _customerWalletAddress =
            //     await CustomerWalletAddressRepository.save({
            //         customer: { id: _customer.id },
            //         wallet_address: 'asdfasfadsfasfafdsafa',
            //     });
            let _customerPreferredCurrency =
                await this.customerRepository_.findOne({
                    where: { id: _customer.id },
                    relations: { preferred_currency: true },
                    select: { id: true },
                });
            console.log(
                `Extending Customer with wallet address: ${_customer.wallet_address}`
            );

            console.log('_customer', _customer);

            return {
                customer: _customer,
                // customerWalletAddress: _customerWalletAddress,
                // customerPreferredCurrency:
                //     _customerPreferredCurrency.preferred_currency,
            };
        } catch (e) {
            console.log('e', e.message);

            console.log(`Error creating customer: ${e}`);
        }
        // lets add a try catch for actually creating a customer?
    }
}
