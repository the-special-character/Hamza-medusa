"use client"
import { useEffect, useState } from "react"
import "@rainbow-me/rainbowkit/styles.css"
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
  Wallet,
} from "@rainbow-me/rainbowkit"
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi"
import { mainnet, optimismSepolia } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

// We need to use 1.x.wagmi since medusa is using @tanstack/react-query": "4.22"
// Define the dark theme configuration
const darkThemeConfig = darkTheme({
  accentColor: "#7b3fe4",
  accentColorForeground: "white",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
})

export interface MyWalletOptions {
  projectId: string
  chains: Chain[]
}

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismSepolia, mainnet],
  [
    alchemyProvider({
      apiKey: "TOXFl-1ug2pYPgCBQ1qDVySYN_yvy5sm",
    }),
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "<https://optimism-sepolia.blockpi.network/v1/rpc/public>",
        }
      },
    }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: "first_app",
  projectId: "1e4dh2uabgfvi1oa",
  chains,
})

const wagmiClient = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  const [isEthereumAvailable, setIsEthereumAvailable] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined" && "ethereum" in window) {
      setIsEthereumAvailable(true)
    }
  }, [])
  return (
    <div>
      <WagmiConfig config={wagmiClient}>
        <RainbowKitProvider theme={darkThemeConfig} chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  )
}
