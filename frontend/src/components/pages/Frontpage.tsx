import { Stack } from '@chakra-ui/react';
import React from 'react';
import SearchBar from '../atoms/SearchBar';
import SustainabilityGoals from '../molecules/SustainabilityGoalsList';

const Frontpage: React.FC = () => (
  <Stack>
    <SearchBar />
    <SustainabilityGoals />
  </Stack>
);

export default Frontpage;
