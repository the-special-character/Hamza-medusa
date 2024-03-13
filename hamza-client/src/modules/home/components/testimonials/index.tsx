"use client"
import React from 'react';
import { Box, Flex, Text, VStack, Icon, useColorModeValue, Container } from '@chakra-ui/react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const Testimonial = () => {
    // Define your HEX colors for icons and text
    const iconColorLeft = "#7B61FF";
    const iconColorRight = "#FABE06";
    const cardBgLeft = "#3B2C4F"; // Card background
    const cardBgRight= "#50483E"; // Card background
    const textColor = "#FFF"

    return (
        <Container maxW="container.xl" p={6} bg="#000" centerContent>
            <Flex justify="center" align="center" wrap="wrap" gap={6}>
                <Box
                    bg={cardBgLeft}
                    w={['100%', '48%', '48%']}
                    p={12}
                    borderRadius="2xl"
                    boxShadow="lg" // Added shadow for depth
                    color={textColor}
                >
                    <Text
                        fontSize="sm"
                        color={"#7B61FF"}
                        zIndex="docked"
                        textAlign="left"
                    >
                        TESTIMONIALS
                    </Text>
                    <VStack spacing={4} align="center" justify="center">

                        <Flex p={4}>
                            <Icon as={FaQuoteRight} color={iconColorLeft} boxSize={10} mr={12} />
                            <Text fontSize={["md", "lg", "xl"]} fontStyle="bold" textAlign="left">
                                Hamza has revolutionized the way I do business. The protocol's clear transactions and real-time reporting have increased my efficiency and profitability.
                            </Text>
                        </Flex>
                        <Box pt={4}>
                            <Text color={"#7B61FF"} fontWeight="bold" fontSize={["sm", "md", "lg"]} textAlign="left">Anna Richardson</Text>
                            <Text fontSize={["xs", "sm", "md"]} fontStyle="italic" opacity={0.7} textAlign="right">Chief Editor at Art+ Magazine</Text>
                        </Box>
                    </VStack>
                </Box>
                <Box
                    bg={cardBgRight}
                    w={['100%', '48%', '48%']}
                    p={12}
                    borderRadius="2xl"
                    boxShadow="lg" // Added shadow for depth
                    color={textColor}
                >
                    <Text
                        fontSize="sm"
                        color={"#FABE06"}
                        zIndex="docked"
                        textAlign="left"
                    >
                        TESTIMONIALS
                    </Text>
                    <VStack spacing={4} align="center" justify="center">
                        <Flex p={4}>
                            <Icon as={FaQuoteRight} color={iconColorRight} mr={12} boxSize={10} />
                            <Text fontSize={["md", "lg", "xl"]} fontStyle="bold" textAlign="left">
                                Hamza has revolutionized the way I do business. The protocol's clear transactions and real-time reporting have increased my efficiency and profitability.
                            </Text>
                        </Flex>
                        <Box pt={4}>
                            <Text color={"#FABE06"}fontWeight="bold" fontSize={["sm", "md", "lg"]} textAlign="left">Anna Richardson</Text>
                            <Text fontSize={["xs", "sm", "md"]} fontStyle="italic" opacity={0.7} textAlign="right">Chief Editor at Art+ Magazine</Text>
                        </Box>
                    </VStack>
                </Box>
            </Flex>
        </Container>
    );
};

export default Testimonial;
