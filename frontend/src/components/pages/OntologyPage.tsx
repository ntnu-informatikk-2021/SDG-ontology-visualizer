import { Stack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';
import FullscreenContext from '../../context/FullscreenContext';

const OntologyPage: React.FC = () => {
  const { isFullscreen } = useContext(FullscreenContext);

  return (
    <Stack spacing="4" px={[null, null, '0', '20']}>
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
