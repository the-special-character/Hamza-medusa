// hooks/useCustomTheme.ts
import { extendTheme } from '@chakra-ui/react';


import {Galindo} from "@next/font/google";
import {Press_Start_2P} from "@next/font/google";

const galindo = Galindo({
    subsets: ['latin'],
    weight: "400"
})

const pressStart2P = Press_Start_2P({
    subsets: ['latin'],
    weight: "400"
})

const useCustomTheme = () => {
    const theme = extendTheme({
        fonts: {
            heading: galindo, // Ensure your font names match the @font-face declaration
            body: pressStart2P,
        },
        // Add any other theme customizations here
    });

    return theme;
};

export default useCustomTheme;
