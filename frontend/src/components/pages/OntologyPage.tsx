import { Stack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import DetailView from '../molecules/DetailView';
import GraphContainer from '../molecules/GraphContainer';
import SubGoalsGrid from '../molecules/SubGoalsGrid';

const OntologyPage: React.FC = () => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  return (
    <Stack spacing={8} px={isFullscreen ? 0 : [null, null, null, '0', '10']}>
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
