'use client'
import { Text, clx } from "@medusajs/ui"
import { PriceType } from "../product-actions"
import { useCustomerAuthStore } from "@store/customer-auth/customer-auth"

export default async function PreviewPrice({ prices }: { prices: { currency_code: string, amount: number }[] }) {

  const { preferred_currency_code, status } = useCustomerAuthStore();
  let preferredPrice = (status == 'authenticated' && preferred_currency_code && prices.find(a => a.currency_code == preferred_currency_code)) || null

  return (
    <div className="flex flex-row space-x-2">
      {preferredPrice ? <Text
        key={preferredPrice.currency_code}
        className={clx("text-ui-fg-muted font-bold text-white text-ui-fg-interactive font-bold text-white"
        )}
      >
        {preferredPrice.amount}{" "}{preferredPrice.currency_code}
      </Text> : <>{prices.map((price) => {
        return <Text
          key={price.currency_code}
          className={clx("text-ui-fg-muted font-bold text-white text-ui-fg-interactive font-bold text-white"
          )}
        >
          {price.amount}{" "}{price.currency_code}
        </Text>
      })}</>}


    </div>
  )
}
