import React from 'react';
import { Grid, Box, Image, Text, Heading, VStack } from '@chakra-ui/react';

const RecommendedItems = () => {
    // Sample data for the items, replace with your actual data
    const items = [
        { id: 1, name: 'T-shirts with multiple colors, for men', price: '$10.30', imageUrl: 'path_to_image' },
        { id: 2, name: 'Jeans shorts for men blue color', price: '$10.30', imageUrl: 'path_to_image' },
        { id: 3, name: 'Brown winter coat medium size', price: '$12.50', imageUrl: 'path_to_image' },
        // ... Add more items
    ];

    return (
        <Box bg="black" color="white" p={5}>
            <Heading mb={5} textAlign="center">Recommended items</Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
                {items.map((item) => (
                    <VStack // Using VStack for vertical centering
                        key={item.id}
                        boxShadow='md'
                        rounded='lg'
                        overflow='hidden'
                        p={5}
                        bg='white'
                        align='center' // Centers content horizontally within the VStack
                        spacing={4} // Adjust the space between items
                    >
                        <Image src={item.imageUrl} alt={item.name} boxSize='150px' objectFit='cover'/>
                        <Text fontWeight='bold'>{item.price}</Text>
                        <Text>{item.name}</Text>
                    </VStack>
                ))}
            </Grid>
        </Box>
    );
};

export default RecommendedItems;
