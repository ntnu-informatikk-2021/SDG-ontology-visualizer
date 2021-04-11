import { Stack } from '@chakra-ui/react';
import React from 'react';
import { FullscreenContextProvider } from '../../context/FullscreenContext';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';

const OntologyPage: React.FC = () => (
  <FullscreenContextProvider>
    <Stack spacing="10">
      <GraphContainer />
      <DetailView />
      <SubGoalsGrid />
    </Stack>
  </FullscreenContextProvider>
);
export default OntologyPage;
