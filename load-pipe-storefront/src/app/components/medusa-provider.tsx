"use client"

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"

const queryClient = new QueryClient()
const API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNyXzAxSE1HNVFDVzlGU0JCRVpRSzNYOENLQ0VLIiwiZG9tYWluIjoiYWRtaW4iLCJpYXQiOjE3MDY0MzQ5NzcsImV4cCI6MTcwNjUyMTM3N30.j7LsVhyimXgg-9SDAuvTCjbZ_a_1B3O7UrWiCISWBpo"

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
