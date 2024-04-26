import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    wallet_address: string | null;
    token: string | null;
    customer_id: string | null;
    status: AuthenticationStatus;
};

type Actions = {
    setUserAuthData: ({
        wallet_address,
        token,
        customer_id,
    }: {
        wallet_address: string | null;
        token: string | null;
        customer_id: string | null;
    }) => void;
    setStatus: (status: AuthenticationStatus) => void;
};

export const useUserAuthStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            token: null,
            wallet_address: null,
            customer_id: null,
            status: 'unauthenticated',
            setUserAuthData: ({ wallet_address, token, customer_id }) =>
                set({ token, wallet_address, customer_id }),
            setStatus: (status) => set({ status: status }),
        }),

        {
            name: '__hamza_user', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
