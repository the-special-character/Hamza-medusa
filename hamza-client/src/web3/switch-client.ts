import { BigNumberish, ethers } from 'ethers';

const abi = [
    {
        inputs: [
            {
                internalType: 'contract IMasterSwitch',
                name: 'masterSwitch',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'bucketIndex',
                type: 'uint256',
            },
        ],
        name: 'InvalidBucketState',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'InvalidOrderId',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'InvalidOrderState',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'InvalidPaymentOperation',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'InvalidRefundAmount',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'y',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'denominator',
                type: 'uint256',
            },
        ],
        name: 'PRBMath__MulDivOverflow',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount1',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount2',
                type: 'uint256',
            },
        ],
        name: 'PaymentAmountMismatch',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'PaymentFailed',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'expected',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'actual',
                type: 'address',
            },
        ],
        name: 'ReceiverMismatch',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'bytes32',
                name: 'roleId',
                type: 'bytes32',
            },
            {
                internalType: 'address',
                name: 'addr',
                type: 'address',
            },
        ],
        name: 'UnauthorizedAccess',
        type: 'error',
    },
    {
        inputs: [],
        name: 'ZeroAddressArgument',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Paused',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'payer',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'PaymentPlaced',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'refundAmount',
                type: 'uint256',
            },
        ],
        name: 'PaymentRefunded',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bool',
                name: 'success',
                type: 'bool',
            },
        ],
        name: 'PaymentSent',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'caller',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'securityContext',
                type: 'address',
            },
        ],
        name: 'SecurityContextSet',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'Unpaused',
        type: 'event',
    },
    {
        inputs: [],
        name: 'ADMIN_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'APPROVER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'DAO_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'PAUSER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'REFUNDER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'SYSTEM_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'UPGRADER_ROLE',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'approvePayments',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'approvePaymentsBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'freezePending',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'freezePendingBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'getAmountToPayOut',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'getBucketCountWithState',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'getBuckets',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'total',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'state',
                        type: 'uint8',
                    },
                    {
                        components: [
                            {
                                internalType: 'uint256',
                                name: 'id',
                                type: 'uint256',
                            },
                            {
                                internalType: 'address',
                                name: 'payer',
                                type: 'address',
                            },
                            {
                                internalType: 'uint256',
                                name: 'amount',
                                type: 'uint256',
                            },
                            {
                                internalType: 'uint256',
                                name: 'refundAmount',
                                type: 'uint256',
                            },
                        ],
                        internalType: 'struct PaymentBook.Payment[]',
                        name: 'payments',
                        type: 'tuple[]',
                    },
                ],
                internalType: 'struct PaymentBook.PaymentBucket[]',
                name: '',
                type: 'tuple[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'getPaymentById',
        outputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'payer',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'refundAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint8',
                        name: 'state',
                        type: 'uint8',
                    },
                ],
                internalType: 'struct PaymentBook.PaymentWithState',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
            {
                internalType: 'uint8',
                name: 'state',
                type: 'uint8',
            },
        ],
        name: 'getTotalInState',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'masterSwitch',
        outputs: [
            {
                internalType: 'contract IMasterSwitch',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'paymentExists',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'payer',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct PaymentInput[]',
                name: 'payments',
                type: 'tuple[]',
            },
        ],
        name: 'placeMultiPayments',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: 'uint256',
                        name: 'id',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address',
                        name: 'receiver',
                        type: 'address',
                    },
                    {
                        internalType: 'address',
                        name: 'payer',
                        type: 'address',
                    },
                    {
                        internalType: 'uint256',
                        name: 'amount',
                        type: 'uint256',
                    },
                ],
                internalType: 'struct PaymentInput',
                name: 'payment',
                type: 'tuple',
            },
        ],
        name: 'placePayment',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'placePayment2',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'processPayments',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address[]',
                name: 'receivers',
                type: 'address[]',
            },
        ],
        name: 'processPaymentsBatch',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'pullPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'receiver',
                type: 'address',
            },
        ],
        name: 'pushPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'refundPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
        ],
        name: 'reviewPayment',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'securityContext',
        outputs: [
            {
                internalType: 'contract ISecurityContext',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'contract ISecurityContext',
                name: '_securityContext',
                type: 'address',
            },
        ],
        name: 'setSecurityContext',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'tokenAddress',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'pure',
        type: 'function',
    },
    {
        inputs: [],
        name: 'unpause',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

/**
 * Input params to a single payment to the Switch.
 */
export interface IPaymentInput {
    id: BigNumberish;
    receiver: string;
    payer: string;
    amount: BigNumberish;
}

export interface ITransactionOutput {
    transaction_id: string;
    tx: any;
    receipt: any;
}

/**
 * Input params to a payment to the Switch, plus a property indicating the currency
 * in which the payment is being made.
 */
export interface IPaymentInputCurrency extends IPaymentInput {
    currency: string; //token address, or ethers.ZeroAddress for native
}

/**
 * Input params for multiple concurrent payments to the switch.
 */
export interface IMultiPaymentInput {
    receiver: string;
    currency: string; //token address, or ethers.ZeroAddress for native
    payments: IPaymentInput[];
}

/**
 * Client-side Switch contract client; allows for payments to be made.
 */
export class SwitchClient {
    contractAddress: string;
    paymentSwitch: ethers.Contract;
    provider: ethers.Provider;
    signer: ethers.Signer;
    tokens: { [id: string]: ethers.Contract } = {};

    /**
     * Constructor.
     * @param address Address of the PaymentSwitch contract
     */
    constructor(
        provider: ethers.Provider,
        signer: ethers.Signer,
        address: string
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contractAddress = address;
        this.paymentSwitch = new ethers.Contract(
            this.contractAddress,
            abi,
            signer
        );
    }

    /**
     * Place a single payment in a single currency.
     * @param input The payment input
     */
    async placeSinglePayment(
        input: IPaymentInput
    ): Promise<ITransactionOutput> {
        const tx = await this.paymentSwitch.placePayment(input, {
            value: input.amount,
        });
        const transaction_id = tx.hash;
        const receipt = await tx.wait();

        return {
            transaction_id,
            tx,
            receipt,
        };
    }

    async placePayment(amount: number): Promise<ITransactionOutput> {
        const tx = await this.paymentSwitch.placePayment2(amount, {
            value: amount,
        });
        const transaction_id = tx.identifier;
        const receipt = await tx.wait();

        return {
            transaction_id,
            tx,
            receipt,
        };
    }

    /**
     * Place multiple payments in single or multiple different currencies.
     * @param inputs An array of payment inputs
     */
    async placeMultiplePayments(inputs: IMultiPaymentInput[]) {
        //make any necessary token approvals
        await this._approveAllTokens(this.contractAddress, inputs);

        //place payments
        await this.paymentSwitch.placeMultiplePayments(inputs);
    }

    /**
     * In a batch of payments to be made, total up the amounts per currency. Returns a
     * dictionary of distinct token addresses, with their respective total amounts.
     *
     * @param inputs An array of payment inputs
     * @returns A dictionary in which the keys are token addresses, the values are amounts.
     */
    _getTokensAndAmounts(inputs: IMultiPaymentInput[]): {
        [id: string]: BigNumberish;
    } {
        const output: { [id: string]: BigNumberish } = {};
        const sum = (arr: { amount: BigNumberish }[]) =>
            arr.reduce(
                (acc, obj) => BigInt(acc) + BigInt(obj.amount),
                BigInt(0)
            );

        inputs.forEach((i) => {
            //place a 0 if entry is null, otherwise place a sum of all payments
            if (i.currency != ethers.ZeroAddress) {
                output[i.currency] = output[i.currency]
                    ? BigInt(output[i.receiver]) + sum(i.payments)
                    : 0;
            }
        });
        return output;
    }

    /**
     * Gets the token contract corresponding to the given address, and stores it
     * for later.
     *
     * @param address An ERC20 token address
     * @returns An ethers.Contract object
     */
    _getTokenContract(address: string): ethers.Contract {
        let output: ethers.Contract = this.tokens[address];

        //if not yet created, create & store it
        if (!output) {
            output = new ethers.Contract(address, [], null);
            this.tokens[address] = output;
        }

        return output;
    }

    /**
     * Given an array of payment inputs, makes any token approvals that are necessary
     * in order for the payments to be completed.
     *
     * @param spender The contract address which will receive approval
     * @param inputs An array of payment inputs
     */
    async _approveAllTokens(
        spender: string,
        inputs: IMultiPaymentInput[]
    ): Promise<void> {
        const tokenAmounts = this._getTokensAndAmounts(inputs);

        //approve each token amount
        const promises: Promise<void>[] = [];
        for (let tokenAddr in tokenAmounts) {
            promises.push(
                this._approveToken(spender, tokenAddr, tokenAmounts[tokenAddr])
            );
        }
        await Promise.all(promises);
    }

    /**
     * Approves an amount of a token to be spent, if the existing allowance is insufficient.
     *
     * @param spender The contract address which will receive approval
     * @param tokenAddr The token address
     * @param amount The amount that needs to be approved
     */

    // TODO: Need to triple check this one, not really sure what I'm doing here - G (was necessary to build)
    async _approveToken(
        spender: string,
        tokenAddr: string,
        amount: BigNumberish
    ): Promise<void> {
        const token = this._getTokenContract(tokenAddr);

        //check first for existing allowance before approving
        const allowance = BigInt(
            await token.allowance(/*owner*/ ethers.ZeroAddress, spender)
        );

        // Convert amount to bigint for comparison and arithmetic, assuming it could be string, number, or bigint already
        // BigNumber instances (from ethers.js or similar libraries) should be converted to string or number before passing to this function
        const bigintAmount = BigInt(amount);

        if (allowance > 0) {
            amount =
                allowance < bigintAmount ? bigintAmount - allowance : BigInt(0);
        }

        // Approve if necessary
        if (bigintAmount > 0) {
            await token.approve(spender, bigintAmount.toString()); // Convert bigint back to string for the smart contract call
        }
    }
}
