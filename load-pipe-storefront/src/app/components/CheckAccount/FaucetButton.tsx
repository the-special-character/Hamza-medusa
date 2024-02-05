"use client"
import { useState } from "react"
import { createWalletClient, http, parseEther } from "viem"
import { useAccount, useNetwork } from "wagmi"
import { useAccountBalance } from "@lib/hooks/useAccountBalance"
import { optimismSepolia } from "wagmi/chains"

const FAUCET_ADDRESS = "0xb975Bf5ca0b09E17834d0b5A526F8315F82986D4"

const localWalletClient = createWalletClient({
  chain: optimismSepolia,
  transport: http(),
})
export const FaucetButton = () => {
  const { address } = useAccount()
  const { balance } = useAccountBalance(address)

  const [loading, setLoading] = useState(false)

  const { chain: ConnectedChain } = useNetwork()
  return (
    <div
      className={
        balance
          ? "ml-1"
          : "ml-1 tooltip tooltip-bottom tooltip-secondary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:right-0"
      }
      data-tip="Grab funds from faucet"
    >
      <p>Balance: {balance ? `${balance} ETH` : "Unable to fetch balance"}</p>
    </div>
  )
}
