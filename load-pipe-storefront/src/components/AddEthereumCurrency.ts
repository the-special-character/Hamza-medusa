import React from "react"
import { useAdminAddStoreCurrency } from "medusa-react"
const AddEthereumCurrency = () => {
  const addCurrency = useAdminAddStoreCurrency()

  const handleAdd = (code: string) => {
    addCurrency.mutate(code, {
      onSuccess: ({ store }) => {
        console.log(store.currencies)
      },
    })
  }
}

export default AddEthereumCurrency
