"use client"
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useWalletClient } from 'wagmi'
import { bundlerActions, getAccountNonce, walletClientToSmartAccountSigner, ENTRYPOINT_ADDRESS_V07, ENTRYPOINT_ADDRESS_V06 } from 'permissionless'
import { pimlicoBundlerActions, pimlicoPaymasterActions, } from 'permissionless/actions/pimlico'
import { signerToSafeSmartAccount } from 'permissionless/accounts'
import { Address, Client, Hash, Hex, PrivateKeyAccount, createClient, createPublicClient, PublicClient, encodeFunctionData, http, encodePacked, concatHex, zeroAddress, hexToBigInt, keccak256, getContractAddress } from 'viem'
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
    setAuthenticationStatus: (authenticationStatus: any) => void
    setSigner: (signer: any) => void
    setWalletClient: (walletClient: any) => void
    deploySafe: () => Promise<void>
}

const initialState = {
    authenticationStatus: "unauthenticated",
    signer: null,
    PublicClient: null,
    bundlerClient: null,
    pimlicoPaymasterClient: null,
    walletClient: null,
    safeAccount: null,
    setAuthenticationStatus: (authenticationStatus: any) => {},
    setSigner: (signer: any) => {},
    setWalletClient: (walletClient: any) => {},
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

export const enableModuleCallData = (safe4337ModuleAddress: `0x${string}`) => {
    return encodeFunctionData({
        abi: [
            {
                inputs: [
                    {
                        internalType: 'address[]',
                        name: 'modules',
                        type: 'address[]'
                    }
                ],
                name: 'enableModules',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        functionName: 'enableModules',
        args: [[safe4337ModuleAddress]]
    })
}

type InternalTx = {
    to: Address
    data: `0x${string}`
    value: bigint
    operation: 0 | 1
}

export const encodeMultiSend = (txs: InternalTx[]): `0x${string}` => {
    const data: `0x${string}` = `0x${txs.map((tx) => encodeInternalTransaction(tx)).join('')}`

    return encodeFunctionData({
        abi: [
            {
                inputs: [{ internalType: 'bytes', name: 'transactions', type: 'bytes' }],
                name: 'multiSend',
                outputs: [],
                stateMutability: 'payable',
                type: 'function'
            }
        ],
        functionName: 'multiSend',
        args: [data]
    })
}

export const encodeInternalTransaction = (tx: InternalTx): string => {
    const encoded = encodePacked(
        ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
        [tx.operation, tx.to, tx.value, BigInt(tx.data.slice(2).length / 2), tx.data],
    )
    return encoded.slice(2)
}

const EIP712_SAFE_OPERATION_TYPE = {
    SafeOp: [
        { type: 'address', name: 'safe' },
        { type: 'uint256', name: 'nonce' },
        { type: 'bytes', name: 'initCode' },
        { type: 'bytes', name: 'callData' },
        { type: 'uint256', name: 'callGasLimit' },
        { type: 'uint256', name: 'verificationGasLimit' },
        { type: 'uint256', name: 'preVerificationGas' },
        { type: 'uint256', name: 'maxFeePerGas' },
        { type: 'uint256', name: 'maxPriorityFeePerGas' },
        { type: 'bytes', name: 'paymasterAndData' },
        { type: 'uint48', name: 'validAfter' },
        { type: 'uint48', name: 'validUntil' },
        { type: 'address', name: 'entryPoint' }
    ]
}

export const signUserOperation = async (
    userOperation: UserOperation,
    signer: PrivateKeyAccount,
    chainId: any,
    safe4337ModuleAddress: any
) => {
    const signatures = [
        {
            signer: signer.address,
            data: await signer.signTypedData({
                domain: {
                    chainId,
                    verifyingContract: safe4337ModuleAddress
                },
                types: EIP712_SAFE_OPERATION_TYPE,
                primaryType: 'SafeOp',
                message: {
                    safe: userOperation.sender,
                    nonce: userOperation.nonce,
                    initCode: userOperation.initCode,
                    callData: userOperation.callData,
                    callGasLimit: userOperation.callGasLimit,
                    verificationGasLimit: userOperation.verificationGasLimit,
                    preVerificationGas: userOperation.preVerificationGas,
                    maxFeePerGas: userOperation.maxFeePerGas,
                    maxPriorityFeePerGas: userOperation.maxPriorityFeePerGas,
                    paymasterAndData: userOperation.paymasterAndData,
                    validAfter: '0x000000000000',
                    validUntil: '0x000000000000',
                    entryPoint: ENTRYPOINT_ADDRESS_V06
                }
            })
        }
    ]
    signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()))
    let signatureBytes: Address = '0x000000000000000000000000'
    for (const sig of signatures) {
        signatureBytes += sig.data.slice(2)
    }
    return signatureBytes
}

export const generateApproveCallData = (erc20TokenAddress: Address, paymasterAddress: Address) => {
    const approveData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "_spender", type: "address" },
                    { name: "_value", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        args: [paymasterAddress, BigInt(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)],
    })

    // GENERATE THE CALLDATA TO APPROVE THE USDC
    const to = erc20TokenAddress
    const value = 0n
    const data = approveData

    const callData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "dest", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "func", type: "bytes" },
                ],
                name: "execute",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        args: [to, value, data],
    })

    return callData
}

export const getInitializerCode = async ({
    owner,
    addModuleLibAddress,
    safe4337ModuleAddress,
    multiSendAddress,
    erc20TokenAddress,
    paymasterAddress
}: {
    owner: Address
    addModuleLibAddress: Address
    safe4337ModuleAddress: Address
    multiSendAddress: Address
    erc20TokenAddress: Address
    paymasterAddress: Address
}) => {
    const setupTxs: InternalTx[] = [
        {
            to: addModuleLibAddress,
            data: enableModuleCallData(safe4337ModuleAddress),
            value: 0n,
            operation: 1 // 1 = DelegateCall required for enabling the module
        },
    ]

    if (erc20TokenAddress != zeroAddress && paymasterAddress != zeroAddress) {
        setupTxs.push({
            to: erc20TokenAddress,
            data: generateApproveCallData(erc20TokenAddress, paymasterAddress),
            value: 0n,
            operation: 0 // 0 = Call
        })
    }

    const encodeMultiSend = (txs: InternalTx[]): `0x${string}` => {
        const data: `0x${string}` = `0x${txs.map((tx) => encodeInternalTransaction(tx)).join('')}`

        return encodeFunctionData({
            abi: [
                {
                    inputs: [{ internalType: 'bytes', name: 'transactions', type: 'bytes' }],
                    name: 'multiSend',
                    outputs: [],
                    stateMutability: 'payable',
                    type: 'function'
                }
            ],
            functionName: 'multiSend',
            args: [data]
        })
    }

    const multiSendCallData = encodeMultiSend(setupTxs);

    return encodeFunctionData({
        abi: [
            {
                inputs: [
                    {
                        internalType: 'address[]',
                        name: '_owners',
                        type: 'address[]'
                    },
                    {
                        internalType: 'uint256',
                        name: '_threshold',
                        type: 'uint256'
                    },
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address'
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes'
                    },
                    {
                        internalType: 'address',
                        name: 'fallbackHandler',
                        type: 'address'
                    },
                    {
                        internalType: 'address',
                        name: 'paymentToken',
                        type: 'address'
                    },
                    {
                        internalType: 'uint256',
                        name: 'payment',
                        type: 'uint256'
                    },
                    {
                        internalType: 'address payable',
                        name: 'paymentReceiver',
                        type: 'address'
                    },
                ],
                name: 'setup',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        functionName: 'setup',
        args: [[owner], 1n, multiSendAddress, multiSendCallData, safe4337ModuleAddress, zeroAddress, 0n, zeroAddress]
    })
}

export const getAccountInitCode = async ({
    owner,
    addModuleLibAddress,
    safe4337ModuleAddress,
    safeProxyFactoryAddress,
    safeSingletonAddress,
    saltNonce = 0n,
    multiSendAddress,
    erc20TokenAddress,
    paymasterAddress
}: {
    owner: Address
    addModuleLibAddress: Address
    safe4337ModuleAddress: Address
    safeProxyFactoryAddress: Address
    safeSingletonAddress: Address
    saltNonce?: bigint
    multiSendAddress: Address
    erc20TokenAddress: Address
    paymasterAddress: Address
}): Promise<Hex> => {
    if (!owner) throw new Error('Owner account not found')

    console.log("erc20 ", erc20TokenAddress);
    console.log("paymaster ", paymasterAddress);

    const initializer = await getInitializerCode({
        owner,
        addModuleLibAddress,
        safe4337ModuleAddress,
        multiSendAddress,
        erc20TokenAddress,
        paymasterAddress
    })

    const initCodeCallData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: '_singleton',
                        type: 'address'
                    },
                    {
                        internalType: 'bytes',
                        name: 'initializer',
                        type: 'bytes'
                    },
                    {
                        internalType: 'uint256',
                        name: 'saltNonce',
                        type: 'uint256'
                    },
                ],
                name: 'createProxyWithNonce',
                outputs: [
                    {
                        internalType: 'contract SafeProxy',
                        name: 'proxy',
                        type: 'address'
                    },
                ],
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        functionName: 'createProxyWithNonce',
        args: [safeSingletonAddress, initializer, saltNonce]
    })

    return concatHex([safeProxyFactoryAddress, initCodeCallData])
}

export const getAccountAddress = async ({
    client,
    owner,
    addModuleLibAddress,
    safe4337ModuleAddress,
    safeProxyFactoryAddress,
    safeSingletonAddress,
    saltNonce = 0n,
    multiSendAddress,
    erc20TokenAddress,
    paymasterAddress
}: {
    client: PublicClient
    owner: Address
    addModuleLibAddress: Address
    safe4337ModuleAddress: Address
    safeProxyFactoryAddress: Address
    safeSingletonAddress: Address
    saltNonce?: bigint
    multiSendAddress: Address
    erc20TokenAddress: Address
    paymasterAddress: Address
}): Promise<Address> => {
    const proxyCreationCode = await client.readContract({
        abi: [
            {
                inputs: [],
                name: 'proxyCreationCode',
                outputs: [
                    {
                        internalType: 'bytes',
                        name: '',
                        type: 'bytes'
                    }
                ],
                stateMutability: 'pure',
                type: 'function'
            }
        ],
        address: safeProxyFactoryAddress,
        functionName: 'proxyCreationCode'
    })

    const deploymentCode = encodePacked(
        ['bytes', 'uint256'],
        [proxyCreationCode, hexToBigInt(safeSingletonAddress)]
    );

    const initializer = await getInitializerCode({
        owner,
        addModuleLibAddress,
        safe4337ModuleAddress,
        multiSendAddress,
        erc20TokenAddress,
        paymasterAddress
    })

    const salt = keccak256(encodePacked(['bytes32', 'uint256'], [keccak256(encodePacked(['bytes'], [initializer])), saltNonce]))

    return getContractAddress({
        from: safeProxyFactoryAddress,
        salt,
        bytecode: deploymentCode,
        opcode: 'CREATE2'
    })
}

export const encodeCallData = (params: { to: Address; value: bigint; data: `0x${string}` }) => {
    return encodeFunctionData({
        abi: [
            {
                inputs: [
                    {
                        internalType: 'address',
                        name: 'to',
                        type: 'address'
                    },
                    {
                        internalType: 'uint256',
                        name: 'value',
                        type: 'uint256'
                    },
                    {
                        internalType: 'bytes',
                        name: 'data',
                        type: 'bytes'
                    },
                    {
                        internalType: 'uint8',
                        name: 'operation',
                        type: 'uint8'
                    }
                ],
                name: 'executeUserOp',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function'
            }
        ],
        functionName: 'executeUserOp',
        args: [params.to, params.value, params.data, 0]
    })
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
        setSigner,
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