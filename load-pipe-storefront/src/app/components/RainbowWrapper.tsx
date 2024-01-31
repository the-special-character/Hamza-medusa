"use client"
import "@rainbow-me/rainbowkit/styles.css"
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import {
  sepolia,
  mainnet,
  polygon,
  optimism,
  optimismSepolia,
  arbitrum,
  base,
  zora,
} from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

// Define the dark theme configuration
const darkThemeConfig = darkTheme({
  accentColor: "#7b3fe4",
  accentColorForeground: "white",
  borderRadius: "small",
  fontStack: "system",
  overlayBlur: "small",
})

const { chains, publicClient } = configureChains(
  [sepolia, mainnet, polygon, optimism, optimismSepolia],
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

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider theme={darkThemeConfig} chains={chains}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
