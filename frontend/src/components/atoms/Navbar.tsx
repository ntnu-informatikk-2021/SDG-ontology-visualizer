import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spacer, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();

  return (
    <Flex w="100%" align="center" h="70px" px="8">
      <Box>
        <Link fontWeight="bold" color="cyan.600" fontSize="1.5em" as={RouteLink} to="/">
          Trondheim kommune SDG-Ontologi
        </Link>
      </Box>
      <Spacer />
      <Button
        size="lg"
        leftIcon={<InfoIcon />}
        colorScheme="cyan"
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
