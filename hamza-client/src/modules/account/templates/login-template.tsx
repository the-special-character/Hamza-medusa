"use client"

import { useState } from "react"
import UserLogin from "../components/user-login"
import UserRegister from "../components/user-register"


export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex justify-start px-8 py-8">
      {currentView === "sign-in" ? (
        <UserLogin setCurrentView={setCurrentView} />
      ) : (
        <UserRegister setCurrentView={setCurrentView} />
      )}
    </div>
  )
}

export default LoginTemplate
