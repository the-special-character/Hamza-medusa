"use client"
import React from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    Box,
    Card,
    Heading,
    Text,
    Flex,
    Icon,
} from '@chakra-ui/react';
import { CiCirclePlus } from "react-icons/ci";
import {FaQuoteRight} from "react-icons/fa";

const FAQSection = () => {
    return (
        <Box bg="black" p={5} className="w-full">
                <Card
                    direction={{base: 'column', md: 'row'}}
                    overflow="hidden"
                    minHeight="800px"
                    variant="outline"
                    bg="#2C272D"
                    justifyContent="center"
                    alignItems="center"
                    borderRadius="2xl"
                    marginLeft={{ lg: 4 }}
                    marginRight={{ lg: 4 }}
                >
                    <Flex
                        direction={{ base: 'column', lg: 'row' }}
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={{ lg: '6' }}
                        transition="height 0.5s ease"
                    >
                    <Box flex="1" textAlign="left">
                        <Heading mb={4} fontSize={{ base: "3xl", md: "4xl" }}>Got questions? We've got answers.</Heading>
                        <Text fontSize={{ base: "md", md: "lg" }} opacity={0.7}>
                            Everything you need to know about the product and billing.
                        </Text>
                    </Box>

                    <Box flex="1" color="#FFF" minHeight="600px" overflow="auto">
                        <Accordion allowToggle>
                            {/* Repeat for each question */}
                            <AccordionItem border="none">
                                {({ isExpanded }) => (
                                    <>
                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Is there a free trial available?
                                            </Box>
                                            <Icon as={CiCirclePlus} boxSize={8}  />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Can I change my plan later?
                                            </Box>
                                            <Icon as={CiCirclePlus} boxSize={8}  />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>
                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                Can other info be added to an invoice?
                                            </Box>
                                            <Icon as={CiCirclePlus} boxSize={8}  />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                How do I change my account email?
                                            </Box>
                                            <Icon as={CiCirclePlus} boxSize={8}  />
                                        </AccordionButton>
                                        <AccordionPanel pb={4}>
                                            Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.
                                        </AccordionPanel>

                                        <AccordionButton _expanded={{ bg: "gray.600", color: "white" }}>
                                            <Box flex="1" textAlign="left" fontWeight={isExpanded ? "semibold" : "normal"}>
                                                How does billing work?
                                            </Box>
                                            <Icon as={CiCirclePlus} boxSize={8}  />
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
                </Card>
        </Box>
    );
};

export default FAQSection;
