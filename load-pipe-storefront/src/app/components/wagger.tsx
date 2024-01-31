import { useSignMessage } from "wagmi"

const SignMessage = () => {
  const { signMessage } = useSignMessage()

  const handleSign = async () => {
    await signMessage({ message: "Your message here" })
  }

  return <button onClick={handleSign}>Sign Message</button>
}
