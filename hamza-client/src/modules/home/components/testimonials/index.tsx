"use client"
import React from 'react';
import { Box, Text, VStack, Icon, Container } from '@chakra-ui/react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const Testimonial = () => {
    // Define your HEX colors for icons
    const iconColor = '#A0AEC0'; // Lighter gray for icons

    return (
        <Box bg="#000000" w="100%" color="#FFFFFF">
            <Container maxW="container.xl" p={6}>
                <VStack spacing={8} align="center" justify="center">
                    <Icon as={FaQuoteLeft} color={iconColor} boxSize={12} />
                    <Text fontSize={["xl", "2xl", "4xl"]} fontStyle="italic" textAlign="center">
                        "Hamza has revolutionized the way I do business. The protocol's clear transactions and real-time reporting have increased my efficiency and profitability."
                    </Text>
                    <Icon as={FaQuoteRight} color={iconColor} boxSize={12} />
                    <Box pt={4}>
                        <Text fontWeight="bold" fontSize={["md", "lg", "xl"]}>Anna Richardson</Text>
                        <Text fontSize={["sm", "md"]} opacity={0.8}>Chief Editor at Art+ Magazine</Text>
                    </Box>
                </VStack>
            </Container>
        </Box>
    );
};

export default Testimonial;
