import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    wallet_address: string | null;
    token: string | null;
    customer_id: string | null;
    status: AuthenticationStatus;
    preferred_currency: {
        code: string;
        symbol: string;
        symbol_native: string;
        name: string;
    } | null;
};

type Actions = {
    setCustomerAuthData: ({
        wallet_address,
        token,
        customer_id,
        preferred_currency
    }: {
        wallet_address: string | null;
        token: string | null;
        customer_id: string;
        preferred_currency: {
            code: string;
            symbol: string;
            symbol_native: string;
            name: string;
        } | null
    }) => void;
    setStatus: (status: AuthenticationStatus) => void;
};

export const useCustomerAuthStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            token: null,
            wallet_address: null,
            customer_id: null,
            status: 'unauthenticated',
            preferred_currency: null,
            setCustomerAuthData: ({ wallet_address, token, customer_id, preferred_currency }) =>
                set({ token, wallet_address, customer_id, preferred_currency }),
            setStatus: (status) => set({ status: status }),
        }),

        {
            name: '__hamza_customer', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
