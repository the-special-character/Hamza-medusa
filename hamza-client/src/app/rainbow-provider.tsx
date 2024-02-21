"use client"
import { useEffect, useState } from "react"
import "@rainbow-me/rainbowkit/styles.css"
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  AuthenticationStatus,
} from "@rainbow-me/rainbowkit"
import { WagmiConfig } from "wagmi"
import {
  chains,
  config,
  darkThemeConfig,
} from "@/components/RainbowkitUtils/rainbow-utils"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { SiweMessage } from "siwe"
const queryClient = new QueryClient()
const AUTH_WALLET = "http://localhost:9000/custom/wallet"

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated")

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
      setStatus("authenticated")
      return Boolean(verifyRes.ok)
    },
    signOut: async () => {
      await fetch("/api/logout")
    },
  })

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
  )
}
