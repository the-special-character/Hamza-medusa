"use client";
import { Box, Flex, Heading, Button, Image } from '@chakra-ui/react';
import { useState, useEffect } from "react"
import Login from "@/components/AuthenticateAdmin/Login";
import AuthToken from "@/components/GetAdminToken/AuthToken";
import Checker from "@/components/CheckCors/Checker";
import { getCustomer } from '@lib/data';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"


async function connectWallet() {
  console.log("connect wallet");
  useConnectModal();
};

const Hero = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  useEffect(() => {
    getCustomer().then((customer) => {
      setLoggedIn(customer?.has_account ? true: false);
    }).catch(() => { console.log("hero: customer not found")});
  }, []);

  return (
      <Box className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
        <Flex align="center" justify="space-between" className="absolute inset-0 z-10 p-8">
          <Box className="flex-1">
            <Heading as="h1" size="xl" className="text-3xl leading-10 text-ui-fg-base font-normal mb-4">
              Buy & Sell Products Using Crypto as a Community
            </Heading>
            <Heading as="h2" size="lg" className="text-xl leading-normal text-ui-fg-subtle font-normal mb-6">
              By The People, For The People Using Blockchain Tech
            </Heading>
            <Button colorScheme="blue" className="text-lg" onClick={connect}>Connect wallet</Button>

            {/* Uncomment these components if you need them */}
            {/*<Login />*/}
            {/*<Checker/>*/}
            {/*<AuthToken />*/}
          </Box>
          <Box flex="1" className="hidden md:block">
            <Image
                src="http://hamza.biz/wp-content/uploads/2024/01/hamzabiz-img.jpg"
                alt="Image description"
                className="w-full h-auto object-cover"
                fallbackSrc="path_to_fallback_image" // In case the original image fails to load
            />
          </Box>
        </Flex>
      </Box>
  )
}

export default Hero;
