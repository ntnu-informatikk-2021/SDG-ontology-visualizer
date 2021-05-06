import { InfoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Link, Spacer } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouteLink, useHistory } from 'react-router-dom';
import { RootState } from '../../state/store';

const Navbar = () => {
  const history = useHistory();
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  if (isFullscreen) return <></>;

  return (
    <Flex as="nav" align="center" px="10" py="4">
      <Box>
        <h1>
          <Link fontWeight="bold" color="cyan.700" fontSize="1.5em" as={RouteLink} to="/">
            Trondheim kommune SDG-Ontologi
          </Link>
        </h1>
      </Box>
      <Spacer />
      <Button
        size="sm"
        color="white"
        bg="cyan.700"
        justify="center"
        leftIcon={<InfoIcon />}
        _hover={{ backgroundColor: 'cyan.600' }}
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
