"use client"
import Medusa from "@medusajs/medusa-js"

//TODO: (CLEANUP) is this used for anything other than testing?
const MEDUSA_SERVER_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const AuthToken = () => {
  const handleToken = () => {
    const medusa = new Medusa({
      baseUrl: `${MEDUSA_SERVER_URL}`,
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
