'use client';
import { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import {
    createAuthenticationAdapter,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider,
    AuthenticationStatus,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import {
    chains,
    config,
    darkThemeConfig,
} from '@/components/providers/rainbowkit/rainbowkit-utils/rainbow-utils';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
const queryClient = new QueryClient();
import { SiweMessage } from 'siwe';
import { getCustomer, getToken } from '@lib/data';
import { revalidateTag } from 'next/cache';
import { signOut } from '@modules/account/actions';
import { cookies } from 'next/headers';
import { useCustomerAuthStore } from '@store/customer-auth/customer-auth';

const MEDUSA_SERVER_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const VERIFY_MSG = `${MEDUSA_SERVER_URL}/custom/verify`;
const GET_NONCE = `${MEDUSA_SERVER_URL}/custom/nonce`;

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
    const { setCustomerAuthData, token, wallet_address, status, setStatus } =
        useCustomerAuthStore();

    useEffect(() => {
        // getCustomer()
        //     .then((customer) => {
        //         setStatus(
        //             customer?.has_account ? 'authenticated' : 'unauthenticated'
        //         );
        //     })
        //     .catch(() => {
        //         console.log('rainbow-provider: customer not found');
        //     });

        token && wallet_address && setStatus('authenticated');
        (!token || !wallet_address) && setStatus('unauthenticated');
        console.log('status is ', status);
    }, [token, wallet_address]);

    const walletSignature = createAuthenticationAdapter({
        getNonce: async () => {
            console.log('FETCHING NONCE.....');
            const response = await fetch(GET_NONCE);
            const data = await response.text();
            console.log('NONCE DATA: ', data);
            return data;
        },

        createMessage: ({ nonce, address, chainId }) => {
            console.log(
                `Creating message with nonce: ${nonce}, address: ${address}, chainId: ${chainId}`
            );
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            });
            console.log('Message Created', message);
            return message;
        },

        getMessageBody: ({ message }) => {
            console.log('Preparing message:', message);
            const preparedMessage = message.prepareMessage();
            console.log('Message prepared:', preparedMessage);
            return preparedMessage;
        },

        verify: async ({ message, signature }) => {
            try {
                console.log(
                    'Verifying message with signature:',
                    message,
                    signature
                );
                const response = await fetch(VERIFY_MSG, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, signature }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const verifyRes = await response.json(); // Parsing JSON from the response
                console.log('Verification response:', verifyRes);

                // Checking the boolean response to determine the authentication status
                const authenticationStatus = verifyRes.bool_resp
                    ? 'authenticated'
                    : 'unauthenticated';
                console.log(`Verification status: ${authenticationStatus}`);
                setStatus(authenticationStatus);

                if (verifyRes.bool_resp) {
                    await getToken({
                        wallet_address: message.address,
                        email: '',
                        password: '',
                    }).then((token) => {
                        setCustomerAuthData({
                            token,
                            wallet_address: message.address,
                            customer_id: verifyRes.customer_id,
                        });
                    });
                }
                return verifyRes.bool_resp;
            } catch (e) {
                console.error('Error in signing in:', e);
                return false;
            }
        },

        signOut: async () => {
            setStatus('authenticated');
            setCustomerAuthData({
                token: null,
                wallet_address: null,
                customer_id: '',
            });
            return;
        },
    });

    return (
        <div>
            <WagmiConfig config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitAuthenticationProvider
                        adapter={walletSignature}
                        status={status}
                    >
                        <RainbowKitProvider
                            theme={darkThemeConfig}
                            chains={chains}
                            modalSize="compact"
                        >
                            {children}
                        </RainbowKitProvider>
                    </RainbowKitAuthenticationProvider>
                </QueryClientProvider>
            </WagmiConfig>
        </div>
    );
}
