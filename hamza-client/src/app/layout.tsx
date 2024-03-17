import React from "react"
import { Metadata } from "next"
import "styles/globals.css"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
import MedusaProvider from "./medusa-provider" // Import MedusaProvider
import { RainbowWrapper } from "./rainbow-provider"
import { ChakraProvider } from '@chakra-ui/react'
import { SafeContextProvider } from "./contexts/SafeContext"
// TODO: Refactor using scaffold-eth-2 for proper layout.
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="dark">
      <body>
        <div>
          <MedusaProvider>
            <SafeContextProvider>
              <RainbowWrapper>
                  <ChakraProvider>
                    <main className="relative">{props.children}</main>
                  </ChakraProvider>
              </RainbowWrapper>
            </SafeContextProvider>
          </MedusaProvider>
        </div>
      </body>
    </html>
  )
}
