"use client"
import React from "react"
import { useAdminLogin } from "medusa-react"

const Login = () => {
  const adminLogin = useAdminLogin()
  // ...

  const handleLogin = () => {
    adminLogin.mutate(
      {
        email: "garo92039@gmail.com",
        password: "fqT!eBLaJ25a2S8",
      },
      {
        onSuccess: ({ user }) => {
          console.log(user)
          // send authenticated requests now
        },
        onError: (error) => console.error("ERROR FROM AUTH", error),
      }
    )
  }
  return <button onClick={handleLogin}>Login Medusa Admin</button>
}

export default Login
