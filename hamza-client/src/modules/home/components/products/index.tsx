'use client';
import React, { useState, useEffect } from 'react';
import { SimpleGrid, Box, Button, Flex } from '@chakra-ui/react';
import fire from '../../../../../public/product_filters/fire.png';
import gift from '../../../../../public/product_filters/gift.png';
import game from '../../../../../public/product_filters/games.png';
import laptop from '../../../../../public/product_filters/electronics.png';
import collections from '../../../../../public/product_filters/collections.png';
import coinbase from '../../../../../public/wallet_connect/coinbase.png';
import metamask from '../../../../../public/wallet_connect/metamask.png';
import rainbow from '../../../../../public/wallet_connect/rainbow.jpeg';
import wallet from '../../../../../public/wallet_connect/wallet.png';
import arrow from '../../../../../public/Vector.png';
import Image from 'next/image';
import ProductCollections from '@modules/collections/product_collection_filter';

const RecommendedItems = () => {
    const [vendorName, setVendorName] = useState('Goblin Store');

    return (
        <Flex className="font-sora" maxW="100%" bg="black" p={5}>
            <Box
                p={5}
                mx={12}
                bgGradient="linear(to-l, #53594A 70%, #2C272D 100%)" // This creates a gradient from right to left
                borderRadius="2xl"
                boxShadow="lg"
                marginLeft={{ lg: 4 }}
                marginRight={{ lg: 4 }}
                flex="1"
                width="70%"
                bg="#2C272D"
            >
                <Flex
                    justifyItems={'center'}
                    justifyContent={'center'}
                    className="my-4"
                >
                    <Flex>
                        <Box
                            color="whitesmoke"
                            fontWeight="bold"
                            fontSize="2xl"
                            textAlign="center"
                        >
                            CONNECT YOUR <br />
                            FAVORITE WALLET
                        </Box>
                    </Flex>
                    <Flex className="ml-4">
                        <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 4 }}
                            justifyContent="space-around"
                            spacing={5}
                        >
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    bg="transparent"
                                    color="white"
                                    width="full"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                >
                                    <Image
                                        className="mr-2"
                                        src={coinbase}
                                        alt={'Img of coinbase'}
                                        width={22}
                                        height={22}
                                    />
                                    Coinbase
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    width="full"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                >
                                    <Image
                                        className="mr-2"
                                        src={metamask}
                                        alt={'Img of a game'}
                                        width={22}
                                        height={22}
                                    />
                                    Metamask
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    width="full"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                >
                                    <Image
                                        className="mr-2"
                                        src={rainbow}
                                        alt={'Img of a laptop'}
                                        width={22}
                                        height={22}
                                    />
                                    Rainbowkit
                                </Button>
                            </Box>
                            <Box>
                                <Button
                                    fontWeight="italic"
                                    size="lg"
                                    bg="transparent"
                                    color="white"
                                    borderRadius="full"
                                    border="1px" // Sets the border width
                                    borderColor="whiteAlpha.600"
                                >
                                    <Image
                                        className="mr-2"
                                        src={wallet}
                                        alt={'Img of a collections'}
                                        width={22}
                                        height={22}
                                    />
                                    Wallet Connect
                                </Button>
                            </Box>
                        </SimpleGrid>
                    </Flex>
                </Flex>

                <Box
                    height="1px"
                    bg="whiteAlpha.600"
                    opacity="0.5"
                    width="full"
                    borderRadius="full"
                />
                <SimpleGrid
                    spacing={10}
                    columns={{ base: 1, md: 2, xl: 5 }} // Adjusted to your requirements
                    justifyContent="space-around"
                    justifyItems="center"
                    mx={12}
                    my={6}
                >
                    <Button
                        fontWeight="italic"
                        bg="white"
                        size="lg"
                        width="250px"
                        color="black"
                        borderRadius="full"
                        onClick={() => {
                            setVendorName('Goblin Store');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={fire}
                            alt={'Img of a fire'}
                            width={22}
                            height={22}
                        />
                        Goblin Vendor
                    </Button>

                    <Button
                        fontWeight="italic"
                        bg="black"
                        size="lg"
                        width="250px"
                        color="white"
                        borderRadius="full"
                        onClick={() => {
                            setVendorName('Quality Store');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={gift}
                            alt={'Img of a gift'}
                            width={22}
                            height={22}
                        />
                        Quality Vendor
                    </Button>
                    <Button
                        fontWeight="italic"
                        bg="black"
                        size="lg"
                        width="250px"
                        color="white"
                        borderRadius="full"
                        onClick={() => {
                            setVendorName('Headphones Store');
                        }}
                    >
                        <Image
                            className="mr-2"
                            src={game}
                            alt={'Img of a game'}
                            height={22}
                        />
                        Headphone Vendor
                    </Button>
                    <Button
                        fontWeight="italic"
                        bg="black"
                        width="250px"
                        size="lg"
                        color="white"
                        borderRadius="full"
                    >
                        <Image
                            className="mr-2"
                            src={laptop}
                            alt={'Img of a laptop'}
                            width={22}
                            height={22}
                        />
                        Electronics
                    </Button>
                    <Button
                        fontWeight="italic"
                        bg="black"
                        width="250px"
                        size="lg"
                        color="white"
                        borderRadius="full"
                    >
                        <Image
                            className="mr-2"
                            src={collections}
                            alt={'Img of a collections'}
                            width={22}
                            height={22}
                        />
                        Collectible
                    </Button>
                </SimpleGrid>
                <ProductCollections vendorName={vendorName} />
            </Box>
        </Flex>
    );
};

export default RecommendedItems;
