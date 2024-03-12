"use client"

import { getCustomer } from "@lib/data"
import { Customer } from "@medusajs/medusa"
import { logCustomerIn } from "@modules/account/actions"
import React, { useEffect, useState } from "react"
import { custom } from "viem"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"

//TODO: (JK) do we still need this component?
const CUSTOMER_ENDPOINT = "http://localhost:9000/store/custom"
export default function Profile() {
  const [customer, setCustomer] = useState<Omit<Customer, "password_hash"> | null>(null);

  const loadCustomer = () => {
    getCustomer().then((customer) => {
      setCustomer(customer);
    }).catch(() => console.log("rainbow: customer not found"));
  };

  useEffect(() => {
    loadCustomer();
  }, []);

  const isWalletConnected = () => {
    return customer && customer.has_account;
  };

  const { address, isConnected } = useAccount({
    onConnect: () => {
      console.log("wagmi connected A", address);
      loadCustomer();
    },
    onDisconnect: () => {
      console.log("wagmi disconnected A");
    }
  });

  const { connect } = useConnect({
    connector: new InjectedConnector(),
    onSuccess: (data) => {
      console.log("wagmi connected B", address);
      loadCustomer();
    }
  });
  const { disconnect } = useDisconnect({
    onSuccess: () => {
      console.log("wallet disconnected B");
    }
  })
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

  if (isWalletConnected())
    return (
      <div>
        Connected to {customer?.email.substring(0, 42)}
        <button onClick={() => disconnect()}>Disconnect</button>
      </div>
    );
  return <button onClick={() => connect()}>Connect Wallet</button>
}
