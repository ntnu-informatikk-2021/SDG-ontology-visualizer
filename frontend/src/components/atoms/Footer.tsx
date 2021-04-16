import { Center, Text } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';

const Footer = () => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  if (isFullscreen) return <></>;

  return (
    <Center bg="cyan.600" w="100%" p={4} color="white" h="15vh" mt="20">
      <Text fontSize="lg" as="em">
        TRDK03-UN
      </Text>
    </Center>
  );
};

export default Footer;
