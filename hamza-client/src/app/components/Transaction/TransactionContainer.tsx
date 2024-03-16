import { useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractEvent, usePublicClient } from "wagmi";
import { useEffect, useState } from "react";

import counterabi from "../../../lib/counter"

import { Flex, Button } from '@chakra-ui/react';
import { set } from "lodash";

const counterAddress = process.env.COUNTER_CONTRACT_ADDRESS as `0x${string}`;

const ButtonContainer = () => {
    const [ clicker, setClicker ] = useState<boolean>(false);

    const handleClick = async () => {
        if (clicker) {
            setClicker(false);
        }else {
            setClicker(true);
        }
    }   


    const publicClient = usePublicClient();
    const [number, setNumber] = useState<string>("");

    const {address } = useAccount();
    useEffect(() => {

        console.log("address", address);

        publicClient.getBlockNumber().then( blocknumber => {
            publicClient.getContractEvents({
                address: counterAddress,
                abi: counterabi,
                eventName: "NumberChanged",
                fromBlock: blocknumber - BigInt(1000),
                toBlock: "latest"
            }).then(events => {
                console.log("events", events);
            })
        })

    }, [clicker]);
    
    return (
        <Flex justify="center" align="center" m={4}>
            <Button onClick={handleClick}>Click me</Button>
            <p>{address}</p>
        </Flex>
    );
};

export default ButtonContainer;