"use client"
import React, { useEffect } from "react"
import { Metadata } from "next"
import "styles/globals.css"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import type { AppProps } from "next/app"
import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"
import RootLayout from "app/layout" // Import RootLayout
const queryClient = new QueryClient()
import { RainbowWrapper } from "app/components/RainbowWrapper" // Import RainbowWrapper

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <RainbowWrapper>
        <html lang="en" data-mode="light">
          <body>
            <main className="relative">{props.children}</main>
          </body>
        </html>
      </RainbowWrapper>
    </MedusaProvider>
  )
}
