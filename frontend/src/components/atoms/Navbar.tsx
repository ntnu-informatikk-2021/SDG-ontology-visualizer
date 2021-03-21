import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spacer, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();

  return (
    <Flex bg="cyan.600" w="100%" p={4} color="white" mb="20">
      <Box>
        <Link fontWeight="bold" fontSize="1.5em" as={RouteLink} to="/">
          Trondheim kommune SDG-Ontologi
        </Link>
      </Box>
      <Spacer />
      <Button
        size="lg"
        leftIcon={<InfoIcon />}
        colorScheme="whiteAlpha"
        color="white"
        variant="link"
        onClick={() => {
          history.push('/about');
        }}
      >
        Om
      </Button>
    </Flex>
  );
};

export default Navbar;
