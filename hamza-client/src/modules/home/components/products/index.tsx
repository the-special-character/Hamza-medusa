import React from 'react';
import { Grid, Box, Image, Text, Heading, VStack } from '@chakra-ui/react';
import StoreTemplate from "@modules/store/templates"

// TODO: We need to get CORS working such that
// We can import the products by Category, etc...

const RecommendedItems = () => {

    return (
        <Box bg="black" color="white" p={5}>
            <Heading mb={5} textAlign="center">Recommended items</Heading>
            <StoreTemplate/>
        </Box>
    );
};

export default RecommendedItems;
