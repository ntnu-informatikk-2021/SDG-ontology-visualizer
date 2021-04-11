import { Stack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';
import FullscreenContext from '../../context/FullscreenContext';

const OntologyPage: React.FC = () => {
  const { isFullscreen } = useContext(FullscreenContext);

  return (
    <Stack spacing="10">
      <GraphContainer />
      {!isFullscreen && (
        <>
          <DetailView />
          <SubGoalsGrid />
        </>
      )}
    </Stack>
  );
};
export default OntologyPage;
