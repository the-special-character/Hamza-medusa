// App.tsx
import type { AppProps } from "next/app"
import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"
import React from "react"
import RootLayout from "app/layout" // Import RootLayout
const queryClient = new QueryClient()

// TODO: Move the RainbowWrapper here and place inside the MedusaProvider initial UI does not match what was rendered on the server
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl="http://localhost:9000"
    >
      <RootLayout>
        <Component {...pageProps} /> {/* Here you render the current page */}
      </RootLayout>
    </MedusaProvider>
  )
}

export default App
