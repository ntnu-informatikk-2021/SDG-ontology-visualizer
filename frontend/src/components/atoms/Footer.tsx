import { Center, Heading } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const Footer = () => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  if (isFullscreen) return <></>;

  return (
    <footer>
      <Center bg="cyan.700" w="100%" p={4} color="white" h="15vh" mt="20">
        <Heading size="md">TRDK03-UN</Heading>
      </Center>
    </footer>
  );
};

export default Footer;
