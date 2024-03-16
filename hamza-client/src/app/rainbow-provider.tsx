"use client"
import { useState, useEffect } from "react"
import "@rainbow-me/rainbowkit/styles.css"
import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  AuthenticationStatus,
} from "@rainbow-me/rainbowkit"
import { 
    WagmiConfig, 
    useContractWrite, 
    usePrepareContractWrite, 
    useWaitForTransaction, 
    useAccount, 
    useContractEvent, 
    usePublicClient, 
    useWalletClient 
} from "wagmi";
import {
  chains,
  config,
  darkThemeConfig,
} from "@/components/RainbowkitUtils/rainbow-utils"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
const queryClient = new QueryClient()
import { SiweMessage } from "siwe"
import { getCustomer, getToken } from "@lib/data"
import { revalidateTag } from "next/cache"
import { signOut } from "@modules/account/actions"

//permissionless
import { getAccountNonce, createSmartAccountClient, ENTRYPOINT_ADDRESS_V07, ENTRYPOINT_ADDRESS_V06, bundlerActions, getSenderAddress, signUserOperationHashWithECDSA, UserOperation, walletClientToSmartAccountSigner } from "permissionless"
import { signerToSafeSmartAccount } from "permissionless/accounts"
import { createPimlicoBundlerClient, createPimlicoPaymasterClient } from "permissionless/clients/pimlico"
import { Address, concat, createClient, createPublicClient, encodeFunctionData, Hash, http, parseEther, getContract } from "viem"

const VERIFY_MSG = "http://localhost:9000/custom/verify"
const GET_NONCE = "http://localhost:9000/custom/nonce"
export function RainbowWrapper({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthenticationStatus>("unauthenticated")
  const [safeAccount, setSafeAccount] = useState<any>(null);

  useEffect(() => {
    getCustomer().then((customer) => {
      setStatus(customer?.has_account ? "authenticated" : "unauthenticated");
      
    }).catch(() => { console.log("rainbow-provider: customer not found")});
  }, []);
  
  const createSmartAccount = async (WalletClient) => {
    
    console.log("creating public client");
    const publicClient = createPublicClient({
        transport: http("https://rpc.ankr.com/eth_sepolia"),
    });

    console.log("publicClient", publicClient);
    
    const apiKey = "dfc7d1e4-804b-41dc-9be5-57084b57ea73";
    const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;
    
    const paymasterClient = createPimlicoPaymasterClient({
        transport: http(paymasterUrl),
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    console.log ("paymasterClient", paymasterClient);
    
    if (WalletClient) {
      console.log("getting signer...");
      const signer = walletClientToSmartAccountSigner(WalletClient);
      console.log("signer", signer);

      try {
        const safeAccount = await signerToSafeSmartAccount(publicClient, {
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            signer: signer,
            saltNonce: BigInt(0), // optional
            safeVersion: "1.4.1",
        });

        setSafeAccount(safeAccount);
      } catch (e) {
        console.error("Error creating safe account", e);
      }
    }
  }; 

  const walletSignature = createAuthenticationAdapter({
    getNonce: async () => {
      console.log("FETCHING NONCE.....")
      const response = await fetch(GET_NONCE)
      const data = await response.text()
      console.log("NONCE DATA: ", data)
      return data
    },

    createMessage: ({ nonce, address, chainId }) => {
      console.log(`Creating message with nonce: ${nonce}, address: ${address}, chainId: ${chainId}`);
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      })
      console.log("Message Created", message)
      return message
    },

    getMessageBody: ({ message }) => {
      console.log('Preparing message:', message);
      const preparedMessage = message.prepareMessage();
      console.log('Message prepared:', preparedMessage);
      return preparedMessage;
    },

    verify: async ({ message, signature }) => {
      console.log('Verifying message with signature:', message, signature);
      const verifyRes = await fetch(VERIFY_MSG, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      })
      .catch(error => console.error('Error verifying message:', error)); // Error handling for verify fetch

      console.log('Verification response:', verifyRes);
      const authenticationStatus = Boolean(verifyRes.ok) ? "authenticated" : "unauthenticated";
      console.log(`Verification status: ${authenticationStatus}`);
      setStatus(authenticationStatus);
      
      if (authenticationStatus == "authenticated") {
          const { data: WalletClient } = useWalletClient();
          console.log("WalletClient", WalletClient);
          
          console.log("creating AA account");
          await createSmartAccount(WalletClient); 
      }

      await getToken({ 
        wallet_address: message.address,
        email: "", password: ""
      }).then(() => {
        revalidateTag("customer"); 
      });
      return Boolean(verifyRes.ok);
    },

    signOut: async () => {
      await signOut();
    },
  })

  return (
    <div>
      <WagmiConfig config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthenticationProvider
            adapter={walletSignature}
            status={status}
          >
            <RainbowKitProvider
              theme={darkThemeConfig}
              chains={chains}
              modalSize="compact"
            >
              {children}
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </QueryClientProvider>
      </WagmiConfig>
    </div>
  )
}
