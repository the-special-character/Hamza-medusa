import React from 'react';
import {Grid, Box, HStack, Button, Icon} from '@chakra-ui/react';
import StoreTemplate from "@modules/store/templates"
import fire from '../../../../../public/fire.png'
import gift from '../../../../../public/gift.png'
import game from '../../../../../public/games.png'
import laptop from '../../../../../public/electronics.png'
import collections from '../../../../../public/collections.png'
// TODO: We need to get CORS working such that
// We can import the products by Category, etc...
import Image from 'next/image'
const RecommendedItems = () => {

    return (
        <Box bg="#2C272D" color="white" p={12}>
            <HStack justifyContent="space-around" mx={12} my={6}>
                <Button fontWeight="italic" borderRadius="full" color="black">
                    <Image className="mr-2" src={fire} alt={"Img of a fire"} width={22} height={22} />
                      Best Sellers</Button>
                <Button fontWeight="italic" bg="black"
                        color="white"
                        borderRadius="full">
                    <Image className="mr-2" src={gift} alt={"Img of a gift"} width={22} height={22} />
                    Gift Cards</Button>
                <Button fontWeight="italic"  bg="black"
                        color="white"
                        borderRadius="full">
                    <Image className="mr-2" src={game} alt={"Img of a game"} width={22} height={22} />

                    Games</Button>
                <Button fontWeight="italic"  bg="black"
                        color="white"
                        borderRadius="full">
                    <Image className="mr-2" src={laptop} alt={"Img of a laptop"} width={22} height={22} />
                    Electronics</Button>
                <Button fontWeight="italic"  bg="black"
                        color="white"
                        borderRadius="full">
                    <Image className="mr-2" src={collections} alt={"Img of a collections"} width={22} height={22} />
                    Collectible</Button>
            </HStack>
            <StoreTemplate/>
        </Box>
    );
};

export default RecommendedItems;
