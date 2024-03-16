// src/components/ButtonContainer.tsx

import { Flex, Button } from '@chakra-ui/react';

const ButtonContainer = () => {
    return (
        <Flex justify="center" align="center" m={4}>
            <Button>Click me</Button>
        </Flex>
    );
};

export default ButtonContainer;