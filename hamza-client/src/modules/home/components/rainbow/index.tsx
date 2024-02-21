"use client"

import React, { useEffect } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

const CUSTOMER_ENDPOINT = "http://localhost:9000/store/custom"
export default function Profile() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  // useEffect(() => {
  //   if (isConnected) {
  //     fetch(CUSTOMER_ENDPOINT, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ wallet_address: address }),
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Handle the response data
  //         console.log(data)
  //       })
  //       .catch((error) => {
  //         // Handle any errors
  //         console.error("Error:", error)
  //       })
  //   }
  // }, [isConnected, address])
  if (isConnected)
    return (
      <div>
        Connected to {address}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    )
  return <button onClick={() => connect()}>Connect Wallet</button>
}
