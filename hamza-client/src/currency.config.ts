const chainConfig: any = {
    11155111: {
        chain_name: 'sepolia',
        eth: '0x0',
        usdc: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
        usdt: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    },
    11155420: {
        chain_name: 'op-sepolia',
        eth: '0x0',
        usdc: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
        usdt: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
    },
};

const getCurrencyAddress = (chainId: number, currencyId: string) =>
    chainConfig[chainId] ? chainConfig[chainId][currencyId] ?? '' : '';

export default getCurrencyAddress;
