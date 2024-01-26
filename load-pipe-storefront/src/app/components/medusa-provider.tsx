"use client"

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()

export default function MedusaWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      {children}
    </MedusaProvider>
  )
}
