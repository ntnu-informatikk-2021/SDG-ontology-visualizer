import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spacer, Link } from '@chakra-ui/react';
import React from 'react';
import { Link as RouteLink, useHistory } from 'react-router-dom';

const Navbar = () => {
  const history = useHistory();

  return (
    <Flex w="100%" bg="white" zIndex="999" align="center" h="70px" px="8" position="sticky" top="0">
      <Box>
        <Link fontWeight="bold" color="cyan.600" fontSize="1.5em" as={RouteLink} to="/">
          Trondheim kommune SDG-Ontologi
        </Link>
      </Box>
      <Spacer />
      <Button
        size="md"
        justify="center"
        leftIcon={<InfoIcon />}
        colorScheme="cyan"
        variant="outline"
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
