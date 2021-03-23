import { Stack } from '@chakra-ui/react';
import React from 'react';
import Graph from '../atoms/Graph';
import SearchBar from '../atoms/SearchBar';
import DetailView from '../molecules/DetailView';
import SubGoalsGrid from '../molecules/SubGoalsGrid';

const OntologyPage: React.FC = () => (
  <>
    <SearchBar limit={5} margin="2em" />
    <Graph />
    <Stack spacing="10">
      <DetailView />
      <SubGoalsGrid />
    </Stack>
  </>
);
export default OntologyPage;
