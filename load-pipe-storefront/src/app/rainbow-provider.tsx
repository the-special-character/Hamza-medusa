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

const projectId = "aba29725308468c8020e93258c08236e"
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
      apiKey: "VrVSe8y0T1pBnrwgzgFr2vtHl9Dtj3Fn",
    }),
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "https://opt-sepolia.g.alchemy.com/v2/VrVSe8y0T1pBnrwgzgFr2vtHl9Dtj3Fn",
        }
      },
    }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: "op_sep",
  projectId: projectId,
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
