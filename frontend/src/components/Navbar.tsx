import React from 'react';
import { Box, Button, Flex, Spacer, Heading } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

const Navbar = () => (
  <Flex bgGradient="linear(to-r, green.200, pink.500)" w="100%" p={4} color="white">
    <Box>
      <Heading>Trondheim SDG Ontology club</Heading>
    </Box>
    <Spacer />
    <Button leftIcon={<InfoIcon />} colorScheme="teal" variant="solid">
      About
    </Button>
  </Flex>
);

export default Navbar;
