"use client"
import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Box,
    Heading,
    Text,
    Flex,
    Container
} from '@chakra-ui/react';

const FAQSection = () => {
    return (
        <Box bg="#000" color="#FFF" py={12} className="h-[75vh] w-full">
            <Container maxW="container.xl" pt={12}>
                <Flex direction={{ base: 'column', lg: 'row' }} justifyContent="space-between" alignItems="flex-start"
                      gap={{ lg: '12' }} // This adds more space between the two boxes on larger screens
                >
                    <Box flex="1" mb={{ base: 6, lg: 0 }} mr={{ lg: 12 }} textAlign="left"
                         pt={{ lg: '0' }} >
                        <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }}>Got questions? We've got answers.</Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} opacity={0.7}>
                            Everything you need to know about the product and billing.
                        </Text>
                    </Box>

                    <Box flex="1" bg="#000" color="#FFF">
                        <Accordion allowToggle>
                            {/* Repeat for each question */}
                            <AccordionItem border="none">
                                {({ isExpanded }) => (
                                    <>
                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Is there a free trial available?
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Can I change my plan later?
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>
                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Can other info be added to an invoice?
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                How do I change my account email?
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                How does billing work?
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                            {/* Repeat AccordionItem for each FAQ entry */}
                        </Accordion>
                    </Box>
                </Flex>
            </Container>
        </Box>
    );
};

export default FAQSection;
