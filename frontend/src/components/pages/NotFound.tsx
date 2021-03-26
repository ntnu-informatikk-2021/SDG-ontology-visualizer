import { ArrowLeftIcon } from '@chakra-ui/icons';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <Center>
      <Box
        h="container.sm"
        w="container.md"
        mt="32"
        display="flex"
        flexDirection="column"
        alignContent="center"
        justifyContent="space-between"
        bgImage="url('https://media.istockphoto.com/vectors/error-page-or-file-not-found-icon-vector-id924949200?b=1&k=6&m=924949200&s=612x612&w=0&h=eonpW4ymWtCIKLt8k85EhAZ32kiJ-v_LmTEkUcPmg7Q=')"
        bgSize="cover"
        bgPos="center"
        bgRepeat="no-repeat"
      >
        <Box display="flex" flexDirection="column">
          <Heading as="h2" mt="4">
            404 Not Found
          </Heading>
          <Text>This page does not exist</Text>
        </Box>
        <Button
          w="100%"
          colorScheme="blue"
          mr={3}
          onClick={() => {
            history.push('/');
          }}
        >
          <ArrowLeftIcon mr="2" />
          Back to Home Page
        </Button>
      </Box>
    </Center>
  );
};

export default NotFound;
