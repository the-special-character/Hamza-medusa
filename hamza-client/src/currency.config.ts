interface Currency {
    contract_address: string;
    precision: number;
}

const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        usdc: {
            contract_address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
            precision: 6,
        },
        usdt: {
            contract_address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
            precision: 6,
        },
        eth: {
            contract_address: '',
            precision: 18,
        },
    },
    11155420: {
        chain_name: 'op-sepolia',
        usdc: {
            contract_address: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
            precision: 6,
        },
        usdt: {
            contract_address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
            precision: 6,
        },
        eth: {
            contract_address: '',
            precision: 18,
        },
    },
    1: {
        chain_name: 'mainnet',
        usdc: {
            contract_address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            precision: 6,
        },
        usdt: {
            contract_address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            precision: 6,
        },
        eth: {
            contract_address: '',
            precision: 18,
        },
    },
};

const getCurrencyAddress = (chainId: number, currencyId: string) =>
    chainConfig[chainId] ? chainConfig[chainId][currencyId]?.contract_address ?? '' : '';

const getCurrencyPrecision = (chainId: number, currencyId: string) =>
    chainConfig[chainId] ? chainConfig[chainId][currencyId]?.precision ?? 0 : 0;

export { getCurrencyAddress, getCurrencyPrecision };
