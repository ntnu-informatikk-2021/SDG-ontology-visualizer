import React, { useContext } from 'react';
import { Center, Text } from '@chakra-ui/react';
import FullscreenContext from '../../context/FullscreenContext';

const Footer = () => {
  const { isFullscreen } = useContext(FullscreenContext);

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
