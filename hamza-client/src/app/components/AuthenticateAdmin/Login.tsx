"use client"
import React from "react"
import { useAdminLogin } from "medusa-react"

const Login = () => {
  const adminLogin = useAdminLogin()
  // ...

  const handleLogin = () => {
    adminLogin.mutate(
      {
        email: "admin@medusa-test.com",
        password: "supersecret",
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
