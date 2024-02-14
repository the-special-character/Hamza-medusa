import { createAuthenticationAdapter } from "@rainbow-me/rainbowkit"
import { SiweMessage } from "siwe"
// TODO: Since we are developing a prototype we should use siwe but in the future we should make our own custom variation IF we decide that siwe is not secure enough for our use case. Regardless we are using custom for backend and SIWE for client I believe it should be fine but we should double check with the team.

const AUTH_WALLET = "http://localhost:9000/auth/wallet"

export const walletSignMessage = createAuthenticationAdapter({
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
