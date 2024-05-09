import { RelayClient } from '@massmarket/client';

import { randomBytes } from 'crypto';
import { http, createWalletClient, PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

enum ItemField {
    ITEM_FIELD_UNSPECIFIED = 0,
    ITEM_FIELD_PRICE = 1,
    ITEM_FIELD_METADATA = 2,
}

function privateKeyStringToBytes(privateKey: string): Uint8Array {
    privateKey = privateKey.startsWith('0x')
        ? privateKey.substring(2)
        : privateKey;
    const match = privateKey.match(/[\da-f]{2}/gi);
    if (match) {
        return new Uint8Array(match.map((h) => parseInt(h, 16)));
    }

    return new Uint8Array(0);
}

function bufferToString(buffer: Uint8Array): string {
    return '0x' + buffer
        ? Array.from(buffer)
              .map((byte) => byte.toString(16).padStart(2, '0'))
              .join('')
        : '0x'.padEnd(16, '0');
}

export type ProductConfig = {
    name: string;
    price: string;
    description: string;
    image: string;
};

export class RelayClientWrapper {
    private _client: RelayClient;
    private _chain = sepolia;
    private _keyCard: Uint8Array;
    private _cartId: `0x${string}` = '0x0';
    readonly storeId: `0x${string}`;

    get cartId(): `0x${string}` {
        return this._cartId;
    }

    private constructor(
        endpoint: string,
        walletPrivKey: `0x${string}` = '0x0',
        storeId: `0x${string}` = '0x0',
        keyCardPrivKey: string = ''
    ) {
        this.storeId = storeId;
        this._keyCard = new Uint8Array(randomBytes(32));

        if (keyCardPrivKey?.length) {
            this._keyCard = privateKeyStringToBytes(keyCardPrivKey);
        }

        const account: PrivateKeyAccount = privateKeyToAccount(walletPrivKey);

        const wallet = createWalletClient({
            account,
            chain: this._chain,
            transport: http(),
        });

        const STORE_ID = storeId;

        const args = {
            relayEndpoint: `wss://${endpoint}`,
            privateKey: this._keyCard,
            chain: this._chain,
            wallet: wallet,
            storeId: this.storeId,
            useTLS: true,
        };

        this._client = new RelayClient(args);
        this._client.on('event', (e) => this.onEvent(e));
    }

    static async create(
        endpoint: string,
        walletPrivKey: `0x${string}`,
        storeId: `0x${string}` = '0x0'
    ): Promise<RelayClientWrapper> {
        const client: RelayClientWrapper = new RelayClientWrapper(
            endpoint,
            walletPrivKey,
            storeId
        );

        await client.connect();
        const result = await client._client.createStore(client.storeId);
        await client.enrollKeyCard();
        await client._client.login();
        await client._client.writeStoreManifest(client.storeId);

        return client;
    }

    static async login(
        endpoint: string,
        walletPrivKey: `0x${string}` = '0x0',
        storeId: `0x${string}` = '0x0',
        keyCard: `0x${string}`
    ): Promise<RelayClientWrapper> {
        const client: RelayClientWrapper = new RelayClientWrapper(
            endpoint,
            walletPrivKey,
            storeId,
            keyCard
        );

        await client._client.login();

        return client;
    }

    keyCardToString(): string {
        return `0x${bufferToString(this._keyCard)}`;
    }

    async connect(): Promise<void> {
        await this._client.connect();
    }

    async disconnect(): Promise<void> {
        await this._client.disconnect();
    }

    async login(): Promise<any> {
        return await this._client.login();
    }

    async enrollKeyCard(): Promise<any> {
        const result = await this._client.enrollKeycard();
        return result;
    }

    async createProduct(product: ProductConfig): Promise<string> {
        return await this._client.createItem(product.price, {
            name: product.name,
            description: product.description,
            image: product.image,
        });
    }

    async deleteProduct(productId: `0x${string}`): Promise<void> {}

    async updateProductPrice(
        productId: `0x${string}`,
        price: string
    ): Promise<any> {
        const response = await this._client.updateItem(
            productId,
            ItemField.ITEM_FIELD_PRICE,
            price
        );

        return response;
    }

    async addToCart(productId: `0x${string}`, quantity: number) {
        this._cartId = await this._client.createCart();
        await this._client.changeCart(this.cartId, productId, quantity);
    }

    async checkoutEth(
        productId: `0x${string}`,
        quantity: number
    ): Promise<void> {
        await this._client.changeStock([productId], [10]);
        const cartId: `0x${string}` = await this._client.createCart();
        await this._client.changeCart(cartId, productId, quantity);
        await this._client.commitCart(cartId);
    }

    async checkoutErc20(
        productId: `0x${string}`,
        erc20: `0x${string}`,
        quantity: number
    ): Promise<void> {
        const cartId: `0x${string}` = await this._client.createCart();
        await this._client.changeCart(cartId, productId, quantity);
        await this._client.commitCart(cartId, erc20);
    }

    private onEvent(event: any) {
        if (event.request.events) {
            event.request.events.forEach((e: any) => {
                if (e.cartFinalized) {
                    if (e.cartFinalized.eventId) {
                        console.log(
                            'eventid:',
                            `0x${bufferToString(e.cartFinalized.eventId)}`
                        );
                    }
                    if (e.cartFinalized.purchaseAddr) {
                        console.log(
                            'purchaseAddr:',
                            `0x${bufferToString(e.cartFinalized.purchaseAddr)}`
                        );
                    }
                }
            });
        }
    }
}
