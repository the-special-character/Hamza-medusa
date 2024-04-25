import { AuthenticationStatus } from '@rainbow-me/rainbowkit';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type State = {
    wallet_address: string | null;
    token: string | null;
    status: AuthenticationStatus;
};

type Actions = {
    setUserAuthData: ({
        wallet_address,
        token,
    }: {
        wallet_address: string | null;
        token: string | null;
    }) => void;
    setStatus: (status: AuthenticationStatus) => void;
};

export const useUserAuthStore = create<State & Actions>()(
    persist(
        (set, get) => ({
            token: null,
            wallet_address: null,
            status: 'unauthenticated',
            setUserAuthData: ({ wallet_address, token }) =>
                set({ token, wallet_address }),
            setStatus: (status) => set({ status: status }),
        }),

        {
            name: '__hamza_user', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);
