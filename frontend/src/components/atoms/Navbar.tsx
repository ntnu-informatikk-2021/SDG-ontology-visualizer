import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Heading, Spacer } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

const Navbar = () => (
  <Flex bgGradient="linear(to-r, green.200, pink.500)" w="100%" p={4} color="white">
    <Box>
      <Router>
        <Link to="/">
          <Heading>Trondheim SDG Ontology club</Heading>
        </Link>
      </Router>
    </Box>
    <Spacer />
    <Router>
      <Link to="/about">
        <Button leftIcon={<InfoIcon />} colorScheme="teal" variant="solid">
          About
        </Button>
      </Link>
    </Router>
  </Flex>
);

export default Navbar;
