import { ArrowLeftIcon } from '@chakra-ui/icons';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <Stack spacing="10" justify="center" align="center" color="white" h="20em" bg="cyan.800">
      <Heading as="h2" size="3xl">
        404
      </Heading>
      <Text fontSize="xl">Denne siden eksisterer ikke</Text>
      <Button
        colorScheme="white-alpha"
        bg="white"
        color="cyan.800"
        leftIcon={<ArrowLeftIcon />}
        onClick={() => {
          history.push('/');
        }}
      >
        Tilbake til forsiden
      </Button>
    </Stack>
  );
};

export default NotFound;
