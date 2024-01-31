import React from "react"
import { Metadata } from "next"
import "styles/globals.css"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import MedusaProvider from "./components/medusa-provider" // Import MedusaProvider
import { RainbowWrapper } from "@/components/RainbowWrapper"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <div>
          <MedusaProvider>
            <RainbowWrapper>
              <main className="relative">{props.children}</main>
            </RainbowWrapper>
          </MedusaProvider>
        </div>
      </body>
    </html>
  )
}
