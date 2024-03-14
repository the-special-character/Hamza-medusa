import React from 'react';
import {
    Box,
    Flex,
    Text,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Grid,
    GridItem
} from '@chakra-ui/react';

const ToggleSelection = () => {
    const bgColor = '#53594A'; // Dark grey background

    return (
        <Flex bg="black" color="white" direction={{base: 'column', lg: 'row'}} justifyContent="space-between"
              alignItems="start" p={5}>
            <Box flex="1" p={5} bg={bgColor} borderRadius="2xl" boxShadow="lg" marginLeft={{lg: 4}}
                 marginRight={{lg: 4}} color="white">
                <Tabs isFitted variant="enclosed" colorScheme="orange" orientation="vertical">
                    <Flex direction="column" alignItems="flex-start">
                        <TabList>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{bg: '#94D42A', color: 'black'}} // Styling for the selected tab
                            >
                                Buy
                            </Tab>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{bg: '#94D42A', color: 'black'}} // Adjusted to 'black' to keep consistency
                            >
                                Sell
                            </Tab>
                            <Tab
                                borderRadius="full"
                                border="1px solid "
                                p={4}
                                m={8}
                                fontWeight="bold" // Makes text bold for all tabs
                                _selected={{bg: '#94D42A', color: 'black'}} // Styling for the selected tab
                            >
                                Own
                            </Tab>
                        </TabList>
                    </Flex>
                    <TabPanels>

                        <TabPanel>
                            <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
                                <Text fontSize="xs" color={"#94D42A"}>JOIN THE MOVEMENT</Text>
                                <Text fontSize="xl" fontWeight="bold"> Buy products as a Community</Text>
                            </Flex>
                            <Flex m={6} mx={12} justifyContent="space-between">
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                            </Flex>
                            <Flex m={6} mx={12} justifyContent="space-between">
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                            </Flex>
                            <Flex m={6} mx={12} justifyContent="space-between">
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                            </Flex>
                            <Flex m={6} mx={12} justifyContent="space-between">
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                                <Box w='70px' h='10' bg='red.500'/>
                            </Flex>
                        </TabPanel>

                        <TabPanel>
                            <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
                                <Text fontSize="xs" color={"#94D42A"}>JOIN THE MOVEMENT</Text>
                                <Text fontSize="xl" fontWeight="bold"> Buy products as a Community</Text>
                            </Flex>
                        </TabPanel>
                        <TabPanel>
                            <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
                                <Text fontSize="xs" color={"#94D42A"}>JOIN THE MOVEMENT</Text>
                                <Text fontSize="xl" fontWeight="bold"> Buy products as a Community</Text>
                            </Flex>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Flex>
    );
};

export default ToggleSelection;
