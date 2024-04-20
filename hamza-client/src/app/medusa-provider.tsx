"use client"

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()
const API_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY
const MEDUSA_SERVER_URL = process.env.NEXT_CLIENT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export default function MedusaWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <MedusaProvider
        queryClientProviderProps={{ client: queryClient }}
        baseUrl={MEDUSA_SERVER_URL}
        publishableApiKey={API_KEY}
      >
        {children}
      </MedusaProvider>
    </div>
  )
}

