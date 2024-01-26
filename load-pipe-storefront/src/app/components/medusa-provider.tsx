"use client"

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()
const PUB_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY

export default function MedusaWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
      publishableApiKey={PUB_KEY}
    >
      {children}
    </MedusaProvider>
  )
}
