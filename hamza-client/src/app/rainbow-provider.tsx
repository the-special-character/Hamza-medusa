"use client"
import { useState } from "react"
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
const queryClient = new QueryClient()
import { SiweMessage } from "siwe"

const VERIFY_MSG = "http://localhost:9000/custom/verify"
const GET_NONCE = "http://localhost:9000/custom/nonce"
export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated")

  const walletSignature = createAuthenticationAdapter({
    getNonce: async () => {
      console.log("FETCHING NONCE.....")
      const response = await fetch(GET_NONCE)
      const data = await response.text()
      console.log("NONCE DATA: ", data)
      return data
    },
    createMessage: ({ nonce, address, chainId }) => {
      console.log(`Creating message with nonce: ${nonce}, address: ${address}, chainId: ${chainId}`);
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      })
      console.log("Message Created", message)
      return message
    },
    getMessageBody: ({ message }) => {
      console.log('Preparing message:', message);
      const preparedMessage = message.prepareMessage();
      console.log('Message prepared:', preparedMessage);
      return preparedMessage;
    },
    verify: async ({ message, signature }) => {
      console.log('Verifying message with signature:', message, signature);
      const verifyRes = await fetch(VERIFY_MSG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      })
        .catch(error => console.error('Error verifying message:', error)); // Error handling for verify fetch
      console.log('Verification response:', verifyRes);
      const authenticationStatus = Boolean(verifyRes.ok) ? "authenticated" : "unauthenticated";
      console.log(`Verification status: ${authenticationStatus}`);
      setStatus(authenticationStatus);
      return Boolean(verifyRes.ok);
    },
    signOut: async () => {
      console.log('Signing out...');
      setStatus("unauthenticated")
      // destroy session / cookies
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
