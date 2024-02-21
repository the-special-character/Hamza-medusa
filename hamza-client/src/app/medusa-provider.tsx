"use client"

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()
const API_KEY = process.env.ACCESS_TOKEN

export default function MedusaWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <MedusaProvider
        queryClientProviderProps={{ client: queryClient }}
        baseUrl="http://localhost:9000"
        apiKey={API_KEY}
      >
        {children}
      </MedusaProvider>
    </div>
  )
}
