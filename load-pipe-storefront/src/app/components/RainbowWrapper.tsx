"use client"
import "@rainbow-me/rainbowkit/styles.css"
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { mainnet, optimismSepolia } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

// We need to use 1.x.wagmi since medusa is using @tanstack/react-query": "4.22"
// Define the dark theme configuration
const darkThemeConfig = darkTheme({
  accentColor: "#7b3fe4",
  accentColorForeground: "white",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [optimismSepolia, mainnet],
  [
    alchemyProvider({
      apiKey: process.env.ALCHEMY_ID || "TOXFl-1ug2pYPgCBQ1qDVySYN_yvy5sm",
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
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiConfig config={wagmiClient}>
        <RainbowKitProvider theme={darkThemeConfig} chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
