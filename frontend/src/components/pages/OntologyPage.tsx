import { Stack } from '@chakra-ui/react';
import React from 'react';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';

const OntologyPage: React.FC = () => (
  <Stack spacing="10">
    <GraphContainer />
    <DetailView />
    <SubGoalsGrid />
  </Stack>
);
export default OntologyPage;
