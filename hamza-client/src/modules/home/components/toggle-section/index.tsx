import React from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';

const MyComponent = () => {
    // Define your HEX colors
    const bgColor = '#333333'; // Dark grey background
    const buttonColor = '#805AD5'; // Purple button
    const tabIndicatorColor = '#DD6B20'; // Orange tab indicator

    return (
        <Flex bg="black" color="white" direction={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" p={5}>
            <Box flex="1" p={5} bg={bgColor} borderRadius="lg" boxShadow="lg" color="white">
                <Text fontSize="sm" fontWeight="bold" mb={2}>JOIN THE MOVEMENT</Text>
                <Text fontSize="2xl" fontWeight="bold" mt={2} mb={4}>
                    Buy and sell products as a Community
                </Text>
                <Text mb={4}>Loren ipsum dolor sit amet</Text>
                <Button bg={buttonColor} color="white">Know more</Button>
            </Box>

            <Box flex="1" p={5} bg={bgColor} borderRadius="lg" boxShadow="lg" marginLeft={{ md: 4 }} color="white">
                <Tabs isFitted variant="enclosed" colorScheme="orange">
                    <TabList mb="1em">
                        <Tab>Buy</Tab>
                        <Tab>Sell</Tab>
                        <Tab>Own</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Text fontWeight="bold">Dummy text</Text>
                            <Text>We stand behind the exceptional quality.</Text>
                        </TabPanel>
                        <TabPanel>
                            <Text fontWeight="bold">Dummy text</Text>
                            <Text>We stand behind the exceptional dummies.</Text>
                        </TabPanel>
                        <TabPanel>
                            <Text fontWeight="bold">Dummy text</Text>
                            <Text>We stand behind the pipes</Text>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Flex>
    );
};

export default MyComponent;
