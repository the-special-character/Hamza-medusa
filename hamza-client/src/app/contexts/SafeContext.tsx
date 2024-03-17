"use client"
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { bundlerActions, getAccountNonce, walletClientToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07, ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
import { pimlicoBundlerActions, pimlicoPaymasterActions, } from 'permissionless/actions/pimlico'
import { signerToSafeSmartAccount } from 'permissionless/accounts'
import { Address, Client, Hash, Hex, PrivateKeyAccount, createClient, createPublicClient, PublicClient, encodeFunctionData, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'
import { set } from 'lodash'
import { initialize } from 'next/dist/server/lib/render-server'
 
// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/add-modules-lib.json#L8
const ADD_MODULE_LIB_ADDRESS = '0x8EcD4ec46D4D2a6B64fE960B3D64e8B94B2234eb'
 
// https://github.com/safe-global/safe-modules-deployments/blob/main/src/assets/safe-4337-module/v0.2.0/safe-4337-module.json#L8
const SAFE_4337_MODULE_ADDRESS = '0xa581c4A4DB7175302464fF3C06380BC3270b4037'
 
// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe_proxy_factory.json#L13
const SAFE_PROXY_FACTORY_ADDRESS = '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67'
 
// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/safe.json#L13
const SAFE_SINGLETON_ADDRESS = '0x41675C099F32341bf84BFc5382aF534df5C7461a'
 
// https://github.com/safe-global/safe-deployments/blob/main/src/assets/v1.4.1/multi_send.json#L13
const SAFE_MULTISEND_ADDRESS = '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526'


type safeAccountContextValue = {
    //These are NOT Type safe. Certainly need to be revisited
    authenticationStatus: any
    signer: any
    PublicClient: any
    bundlerClient: any
    pimlicoPaymasterClient: any
    walletClient: any
    safeAccount: any
    setAuthenticationStatus: () => void
    setWalletClient: () => void
    deploySafe: () => Promise<void>
}

type UserOperation = {
    sender: Address
    nonce: bigint
    initCode: Hex
    callData: Hex
    callGasLimit: bigint
    verificationGasLimit: bigint
    preVerificationGas: bigint
    maxFeePerGas: bigint
    maxPriorityFeePerGas: bigint
    paymasterAndData: Hex
    signature: Hex
  }

const initialState = {
    authenticationStatus: "unauthenticated",
    signer: null,
    PublicClient: null,
    bundlerClient: null,
    pimlicoPaymasterClient: null,
    walletClient: null,
    safeAccount: null,
    setAuthenticationStatus: () => {},
    setWalletClient: () => {},
    deploySafe: async () => {}
}

const safeAccountContext = createContext<safeAccountContextValue>(initialState)

const useSafeAccountContext = () => {
    const context = useContext(safeAccountContext)
    if (!context) {
        throw new Error('useSafeAccountContext must be used within a SafeAccountProvider')
    }
    return context
}

const SafeContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticationStatus, setAuthenticationStatus] = useState<any>(initialState.authenticationStatus)
    const [signer, setSigner] = useState<any>(initialState.signer)
    const [PublicClient, setPublicClient] = useState<any>(initialState.PublicClient)
    const [bundlerClient, setBundlerClient] = useState<any>(initialState.bundlerClient)
    const [pimlicoPaymasterClient, setPimlicoPaymasterClient] = useState<any>(initialState.pimlicoPaymasterClient)
    const [walletClient, setWalletClient] = useState<any>(initialState.walletClient)
    const [safeAccount, setSafeAccount] = useState<any>(initialState.safeAccount)

    // Create a Signer in the component

    // Initialize the Clients
    useEffect(() => {
        const initializeClient = async () => {
            try{
                const publicClient = await createPublicClient({
                    transport: http("https://rpc.ankr.com/eth_sepolia"),
                    chain: sepolia,
                });
                setPublicClient(publicClient)
                console.log("publicClient", publicClient)
            }catch(e){
                console.error("Error creating public client", e)
            }

            const PIMLICO_API_KEY = "dfc7d1e4-804b-41dc-9be5-57084b57ea73";
            const PIMLICO_API_V1 = `https://api.pimlico.io/v1/gnosis/rpc?apikey=${PIMLICO_API_KEY}`

            const bundlerClient = await createClient({
            transport: http(PIMLICO_API_V1),
            chain: sepolia
            })
            .extend(bundlerActions(ENTRYPOINT_ADDRESS_V06))
            .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V06))

            setBundlerClient(bundlerClient)

            console.log("bundlerClient", bundlerClient)

            const PIMLICO_API_V2 = `https://api.pimlico.io/v2/gnosis/rpc?apikey=${PIMLICO_API_KEY}`

            const pimlicoPaymasterClient = await createClient({
            transport: http(PIMLICO_API_V2),
            chain: sepolia
            }).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V06))

            setPimlicoPaymasterClient(pimlicoPaymasterClient)

            console.log("pimlicoPaymasterClient", pimlicoPaymasterClient)
            }
        initializeClient()
    }
    , [authenticationStatus])
    

    //need to implement resets when the wallet is disconnected and when the chain is changed
    const deploySafe = useCallback(async () => {
        if (walletClient) {
            const signer = walletClientToSmartAccountSigner(walletClient)
            setSigner(signer)
            try{
                const safeAccount = await signerToSafeSmartAccount(PublicClient, {
                    entryPoint: ENTRYPOINT_ADDRESS_V06,
                    signer: signer,
                    saltNonce: BigInt(0), // optional
                    safeVersion: "1.4.1",
                })
                setSafeAccount(safeAccount)
            }
            catch (e) {
                console.error("Error creating safe account", e)
            }
            
        }
    
    }, [walletClient])

    const value = {
        authenticationStatus,
        signer,
        PublicClient,
        bundlerClient,
        pimlicoPaymasterClient,
        walletClient,
        safeAccount,
        setAuthenticationStatus,
        setWalletClient,
        deploySafe

    };

    return (
        <safeAccountContext.Provider value={value}>
            {children}
        </safeAccountContext.Provider>
    )
}

export { SafeContextProvider, useSafeAccountContext }