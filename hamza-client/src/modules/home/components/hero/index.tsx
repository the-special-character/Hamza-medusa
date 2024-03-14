import {Box, Flex, Heading, Button, Text, Grid, SimpleGrid} from '@chakra-ui/react';
import {FaArrowRight} from "react-icons/fa6";
import Image from 'next/image'
import vr from '../../../../../public/hero/hero_1.png';
import headphones from '../../../../../public/hero/hero_5.png';
import balloons from '../../../../../public/hero/hero_10.png';
const Hero = () => {

    const ImageGrid = () => (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <Image src={vr.src} alt="Testimonial 1" objectFit="cover" />
            <Image src={headphones.src} alt="Testimonial 2" objectFit="cover" />
            {/* Add more <Image /> components for other images you have */}
        </Grid>
    );

    return (
        <Flex maxW="100%" bg="#2C272D" color="white" direction={{base: 'column', lg: 'row'}}
              justifyContent="space-between"
              alignItems="start" p={5}>
            <Box mx={12} bg="black" borderRadius="2xl"
                 className="h-[50vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
                <Flex align="center" justify="space-between" className="absolute inset-0 z-10 p-8">
                    <Box className="flex-1">
                        <Text fontSize="4xl" color="white" textAlign="left">
                            Buy & Sell <br/>
                            Products Using <br/>
                            <Box as="span" fontWeight="bold">Crypto</Box> as a <br/>
                            Community
                        </Text>
                        <Text fontSize="xl" m={2}>
                            By The
                            <Box as="span" fontWeight="bold"> People </Box>
                            <Box as="span" display="inline-flex" alignItems="center"><FaArrowRight className="ml-1 mr-2"
                                                                                                   fontSize={15}/></Box>
                            For The<Box as="span" fontWeight="bold"> People</Box>
                            <br/>
                            Using Blockchain Tech
                        </Text>
                        <Button className="m-4 p-4" fontWeight="italic"
                                size='lg'
                                bg="transparent"
                                color="white"
                                borderRadius="full"
                                border="2px" // Sets the border width
                                borderColor="whiteAlpha.600">Connect wallet <Box as="span" mr={2}/> <FaArrowRight/>
                        </Button>
                    </Box>
                    <Box flex="1" className="hidden md:block">

                        <Box position="absolute" top={100} right={300}  overflow="hidden">
                            <Image width={200} height={300} src={vr.src} alt="Image description" />
                        </Box>
                        <Box position="absolute" zIndex={-1} top={280} right={210}  overflow="hidden">
                            <Image width={110} height={110} src={headphones.src} alt="Image description" />
                        </Box>
                        <Box position="absolute" top={0} right={0}  overflow="hidden">
                            <Image
                                width={200} // Set the width
                                height={300} // Set the height
                                src={balloons.src} alt="Image Balloons" />
                            {/* ... more images */}
                        </Box>

                    </Box>
                </Flex>
            </Box>
        </Flex>
    )
}

export default Hero;
