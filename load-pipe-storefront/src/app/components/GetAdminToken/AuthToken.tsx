"use client"
import Medusa from "@medusajs/medusa-js"

const AuthToken = () => {
  const handleToken = () => {
    const medusa = new Medusa({
      baseUrl: "http://localhost:9000",
      maxRetries: 3,
    })

    medusa.admin.auth
      .getToken({
        email: "garo92039@gmail.com",
        password: "fqT!eBLaJ25a2S8",
      })
      .then(({ access_token }) => {
        console.log("DEM TOKENS", access_token)
      })
  }
  return <button onClick={handleToken}>Get Medusa Admin Token</button>
}

export default AuthToken
