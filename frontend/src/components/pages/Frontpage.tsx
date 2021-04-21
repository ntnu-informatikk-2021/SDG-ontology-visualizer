import { Heading, Stack, Image, Flex } from '@chakra-ui/react';
import React from 'react';
import SearchBar from '../atoms/SearchBar';
import SustainabilityGoals from '../molecules/SustainabilityGoalsList';

const Frontpage: React.FC = () => (
  <Stack spacing="10">
    <Flex
      align="center"
      justify="center"
      justifyContent="space-evenly"
      h="350px"
      spacing="10"
      bg="cyan.700"
    >
      <Stack spacing="10">
        <Heading size="lg" color="white">
          Bærekraftsontologien:
        </Heading>
        <SearchBar limit={5} />
      </Stack>

      <Image src="SDG.png" alt="SDG" w="250px" />
    </Flex>
    <Heading size="lg" align="center" color="cyan.700">
      Bærekraftsmålene:
    </Heading>
    <SustainabilityGoals />
  </Stack>
);

export default Frontpage;
