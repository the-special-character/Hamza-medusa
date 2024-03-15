import Email from "../../../../../public/email_image.png";
import {
    Box,
    FormControl,
    Flex,
    Input,
    Button,
    Heading,
    Text,
    VStack,
    // Image,
    Card,
    CardBody,
    CardFooter
} from '@chakra-ui/react';
import Image from 'next/image'


const ContactSection = () => {
    return (
        <Box bg="black" color="white" p={5}>
            <Card
                direction={{base: 'column', md: 'row'}}
                overflow="hidden"
                variant="outline"
                bg="#2C272D"
                borderRadius="2xl"
                marginLeft={{lg: 4}}
                marginRight={{lg: 4}}
            >
                <VStack
                    spacing={5}
                    align="flex-start"
                    w={{base: '100%', md: '60%'}}
                    p={6}
                >
                    <CardBody>
                        <Heading as="h2" size="xl" mb={4}>Ready to embrace HAMZA?</Heading>
                        <Text fontSize="lg" opacity="0.8" mb={2}>Discover the Future of E-commerce</Text>
                        <Text mb={4}>Dive into the vibrant world of Blockchain. Discover your next product today.</Text>
                        <Flex>
                            <FormControl id="first-name" isRequired mr={3}>
                                <Input borderRadius="full" placeholder="First Name*"/>
                            </FormControl>
                            <FormControl id="email" isRequired mb={3}>
                                <Input borderRadius="full" type="email" placeholder="E-Mail*"/>
                            </FormControl>
                        </Flex>

                        <CardFooter>
                            <Button size="lg" bg="#7B61FF" borderRadius="full">Subscribe</Button>
                        </CardFooter>
                    </CardBody>
                </VStack>

                <Box
                    flexShrink={0}
                    w={{base: '100%', md: '40%'}}
                    alignItems="center"
                    justifyContent="center"
                >
                    <Image
                        objectFit="cover"
                        width={650}
                        height={550}
                        src={Email}
                        alt="Inspirational"
                    />
                </Box>
            </Card>
        </Box>
    );
};

export default ContactSection;
