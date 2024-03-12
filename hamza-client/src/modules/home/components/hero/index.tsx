import { Button, Heading } from "@medusajs/ui"
import Login from "@/components/AuthenticateAdmin/Login"
import AuthToken from "@/components/GetAdminToken/AuthToken"
import Checker from "@/components/CheckCors/Checker"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal"
          >
            Crypto Ecommerce
          </Heading>
          <Heading
            level="h2"
            className="text-3xl leading-10 text-ui-fg-subtle font-normal"
          >
            Marketplace
          </Heading>
        </span>

        {/*<Login />*/}
        {/*<Checker/>*/}
        {/*<AuthToken />*/}
      </div>
    </div>
  )
}

export default Hero
