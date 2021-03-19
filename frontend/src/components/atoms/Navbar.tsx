import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <Flex bgGradient="linear(to-r, green.200, pink.500)" w="100%" p={4} color="white">
    <Box>
      <Link to="/">
        <Heading>Trondheim SDG Ontology club</Heading>
      </Link>
    </Box>
    <Spacer />
    <Link to="/about">
      <Button leftIcon={<InfoIcon />} colorScheme="teal" variant="solid">
        About
      </Button>
    </Link>
  </Flex>
);

export default Navbar;
