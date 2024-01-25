"use client"
import React from "react"
import { useAdminAddStoreCurrency } from "medusa-react"

const AddEthereumCurrency = () => {
  const addCurrency = useAdminAddStoreCurrency()

  const handleAdd = () => {
    addCurrency.mutate("ETH", {
      onSuccess: ({ store }) => {
        console.log("Ethereum added. Store currencies:", store.currencies)
      },
      onError: (error) => {
        console.error("Error adding Ethereum:", error)
      },
    })
  }

  return <button onClick={handleAdd}>Add Ethereum</button>
}

export default AddEthereumCurrency
