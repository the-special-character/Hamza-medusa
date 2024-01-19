import { Metadata } from "next"
import "styles/globals.css"
import { RainbowWrapper } from "@/components/RainbowWrapper"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <RainbowWrapper>
          <main className="relative">{props.children}</main>
        </RainbowWrapper>
      </body>
    </html>
  )
}
