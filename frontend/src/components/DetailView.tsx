import React from 'react';
import { Box, Button } from '@chakra-ui/react';

const data = {
  label: 'Bærekraftsmål navn',
  description: 'beskrivelse',
  isSDGoff: ['subGoal1', 'subGoal2', 'subGoal3'],
};

const option = {
  option1: 'Se detaljer',
  option2: 'Se graf',
};

const DetailView: React.FC = () => {
  const data2 = data;
  console.log(option);

  return (
    <Box bg="tomato" w="100%" p={4} color="white">
      <div>{data2.label}</div>
      <div>{data2.description}</div>
      <div>
        <p style={{ display: 'inline' }}>Har bidrag til</p>
        {data2.isSDGoff.map((relation) => (
          <Button
            onClick={() => console.log('test')}
            colorScheme="blue"
            key={relation}
            style={{ margin: 5 }}
          >
            {relation}
          </Button>
        ))}
      </div>
    </Box>
  );
};

export default DetailView;
