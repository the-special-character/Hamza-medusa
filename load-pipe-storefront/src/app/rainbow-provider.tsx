"use client"
import { useEffect, useState } from "react"
import "@rainbow-me/rainbowkit/styles.css"
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  darkTheme,
  AuthenticationStatus,
} from "@rainbow-me/rainbowkit"
import { WagmiConfig } from "wagmi"
import { chains, config } from "@/components/RainbowkitUtils/rainbow-utils"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SiweMessage } from "siwe"
// We need to use 1.x.wagmi since medusa is using @tanstack/react-query": "4.22"
const queryClient = new QueryClient()
const AUTH_WALLET = "http://localhost:9000/auth/wallet"

const walletSignature = createAuthenticationAdapter({
  getNonce: async () => {
    const response = await fetch(AUTH_WALLET)
    return await response.text()
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      domain: window.location.host,
      address,
      statement: "Sign in with Ethereum to the app.",
      uri: window.location.origin,
      version: "1",
      chainId,
      nonce,
    })
  },
  getMessageBody: ({ message }) => {
    return message.prepareMessage()
  },
  verify: async ({ message, signature }) => {
    const verifyRes = await fetch(AUTH_WALLET, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, signature }),
    })
    return Boolean(verifyRes.ok)
  },
  signOut: async () => {
    await fetch("/api/logout")
  },
})
export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  // Resolve AUTHENTICATION_STATUS
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated")

  return (
    <div>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthenticationProvider
            adapter={walletSignature}
            status={status}
          >
            <RainbowKitProvider
              theme={darkTheme()}
              chains={chains}
              modalSize="compact"
            >
              {children}
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </div>
  )
}
