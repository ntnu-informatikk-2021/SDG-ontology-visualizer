import React from 'react';
import { Flex } from '@chakra-ui/react';

const Footer = () => (
  <Flex
    className="footer"
    bgGradient="linear(to-r, green.200, pink.500)"
    w="100%"
    p={4}
    color="white"
    h="15vh"
  >
    <p>Footer content</p>
  </Flex>
);

export default Footer;
