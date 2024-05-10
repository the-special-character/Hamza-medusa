import { TransactionBaseService } from '@medusajs/medusa';
import ConfirmationTokenRepository from '../repositories/confirmation-token';
import CustomerRepository from '../repositories/customer';
import moment from 'moment';
import keccak256 from 'keccak256';

export default class ConfirmationTokenService extends TransactionBaseService {
    protected readonly confirmationTokenRepository_: typeof ConfirmationTokenRepository;
    protected readonly customerRepository_: typeof CustomerRepository;
    constructor(container) {
        super(container);
        this.confirmationTokenRepository_ = ConfirmationTokenRepository;
        this.customerRepository_ = CustomerRepository;
    }

    async createConfirmationToken({
        customer_id,
        email,
    }: {
        customer_id: string;
        email: string;
    }) {
        let emailCheck = await this.customerRepository_.findOne({
            where: { email: email },
        });
        if (emailCheck) {
            throw new Error('Email already associated with different account');
        }
        let token = keccak256(
            JSON.stringify({ customer_id, email })
        ).toString();
        console.log('token is ', token);
        let confirmationToken = await this.confirmationTokenRepository_.save({
            id: token,
            customer: { id: customer_id },
            email_address: email,
            token: token,
        });
        //sending email

        return;
    }

    async verifyConfirmationToken(token: string) {
        let tokenCheck = await this.confirmationTokenRepository_.findOne({
            where: { token: token },
        });
        if (!token) {
            throw new Error("Token doesn't exists");
        }
        if (tokenCheck.redeemed) {
            throw new Error('Token redemmed already');
        }
        if (
            moment().diff(tokenCheck.created_at, 'hour') >
            -tokenCheck.expiration_hours
        ) {
            throw new Error('Token Expired');
        }

        let customerData = await this.customerRepository_.findOne({
            where: { id: tokenCheck.customer_id },
            relations: { walletAddresses: true },
        });
        if (customerData.walletAddresses.length == 0) {
            throw new Error('Please link a wallet before email verification');
        }

        await this.customerRepository_.update(
            { id: customerData.id },
            { is_verified: true, email: tokenCheck.email_address }
        );
        await this.confirmationTokenRepository_.update(
            { id: tokenCheck.id },
            { redeemed: true }
        );
        return;
    }
}
