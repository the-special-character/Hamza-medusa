import {Flex, Box, FormControl, FormLabel, Input, Button, Heading, Text, VStack} from '@chakra-ui/react';

const ContactSection = () => {
    return (
        <Box bg="gray.900" color="white" py={12} px={12}>
            <Flex
                direction={{base: 'column', md: 'row'}}
                align="center"
                justify="center"
                gap={10} // Adjust the gap for spacing between the left and right parts
                p={{base: 6, md: 10}} // Adjust overall padding if necessary
            > <VStack
                spacing={5} // Reduced spacing between VStack elements
                align="flex-start"
                maxW={{md: 'lg'}} // Optional: You can constrain the width of the VStack for better control
                mb={{base: 6, md: 0}}
            >

                <Heading as="h2" size="xl">Ready to embrace HAMZA?</Heading>
                <Text fontSize="lg" opacity="0.8">Discover the Future of E-commerce</Text>
                <Text>Dive into the vibrant world of Blockchain. Discover your next product today.</Text>
                <FormControl id="first-name" isRequired>
                    <FormLabel>First Name*</FormLabel>
                    <Input placeholder="John"/>
                </FormControl>
                <FormControl id="email" isRequired>
                    <FormLabel>E-Mail*</FormLabel>
                    <Input type="email" placeholder="john@example.com"/>
                </FormControl>
                <Button size="lg" colorScheme="yellow">Subscribe</Button>
            </VStack>

                <Box
                    flexShrink={0} // Prevents the box from shrinking
                    w={{ base: '100%', md: '40%' }} // Adjust the width on medium screens and up
                    bg="gray.800"
                    borderRadius="lg"
                    p={6} // Adjust padding inside the box
                    alignItems="center"
                >
                    {/* Place image or any content here */}
                    <Text>Image or Content goes here</Text>
                </Box>
            </Flex>
        </Box>
    );
};

export default ContactSection;
