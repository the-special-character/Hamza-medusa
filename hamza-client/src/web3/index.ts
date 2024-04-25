import { BigNumberish, ethers } from 'ethers';

/**
 * Input params to a single payment to the Switch.
 */
export interface IPaymentInput {
    id: BigNumberish;
    receiver: string;
    payer: string;
    amount: BigNumberish;
    currency?: string; //token address, or ethers.ZeroAddress for native
}

/**
 * Output from a Switch transaction execution.
 */
export interface ITransactionOutput {
    transaction_id: string;
    tx: any;
    receipt: any;
}

/**
 * Input params for multiple concurrent payments to the switch.
 */
export interface IMultiPaymentInput {
    receiver: string;
    currency: string; //token address, or ethers.ZeroAddress for native
    payments: IPaymentInput[];
}
