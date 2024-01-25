import React, { useEffect } from "react"
import { Metadata } from "next"
import "styles/globals.css"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import type { AppProps } from "next/app"
import RootLayout from "app/layout" // Import RootLayout
import { RainbowWrapper } from "app/components/RainbowWrapper" // Import RainbowWrapper

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    // <MedusaProvider
    //   queryClientProviderProps={{ client: queryClient }}
    //   baseUrl="http://localhost:9000"
    // >
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
    // </MedusaProvider>
  )
}
