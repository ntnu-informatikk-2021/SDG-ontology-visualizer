import React from 'react';
import { Box, Button, Flex, Spacer, Heading } from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { Link, BrowserRouter as Router, withRouter } from 'react-router-dom';

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

export default withRouter(Navbar);
