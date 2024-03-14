import { Box, Flex, Heading, Button, Text } from '@chakra-ui/react';
import { FaArrowRight } from "react-icons/fa6";
import arrow from '../../../../../public/Vector.png'
import Image from 'next/image'
const Hero = () => {
  return (
      <Flex maxW="100%" bg="#2C272D" color="white" direction={{base: 'column', lg: 'row'}} justifyContent="space-between"
            alignItems="start" p={5}>
      <Box mx={12} bg="black" borderRadius="2xl" className="h-[50vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
        <Flex align="center" justify="space-between" className="absolute inset-0 z-10 p-8">
          <Box className="flex-1">
            <Text fontSize="4xl" color="white" textAlign="left">
              Buy & Sell <br />
              Products Using <br />
              <Box as="span" fontWeight="bold">Crypto</Box> as a <br />
              Community
            </Text>
            <Text fontSize="xl" m={2}>
              By The
              <Box as="span" fontWeight="bold"> People </Box>
              <Box as="span" display="inline-flex" alignItems="center"><FaArrowRight className="ml-1 mr-2" fontSize={15} /></Box>
              For The<Box as="span" fontWeight="bold"> People</Box>
              <br />
              Using Blockchain Tech
            </Text>
            <Button className="m-4 p-4" fontWeight="italic"
                    size='lg'
                    bg="transparent"
                    color="white"
                    borderRadius="full"
                    border="2px" // Sets the border width
                    borderColor="whiteAlpha.600">Connect wallet  <Box as="span" mr={2} /> <FaArrowRight /> </Button>
          </Box>
          <Box flex="1" className="hidden md:block">

          </Box>
        </Flex>
      </Box>
      </Flex>
  )
}

export default Hero;
