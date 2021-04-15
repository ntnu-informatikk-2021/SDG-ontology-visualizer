import { Flex, Stack } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { isSubgoal } from '../../common/node';
import FullscreenContext from '../../context/FullscreenContext';
import { GraphNode } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphDescriptions from './GraphDescriptions';
import GraphToolBar from '../atoms/GraphToolbar';
import SearchBar from '../atoms/SearchBar';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);
  const [unlockNodes, setUnlockNodes] = useState<boolean>(false);
  const { isFullscreen } = useContext(FullscreenContext);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };

  return (
    <Stack
      bg="gray.400"
      h={isFullscreen ? '100vh' : '80vh'}
      w={isFullscreen ? '100vw' : ''}
      spacing="5"
      p={isFullscreen ? '0' : '10'}
      position={isFullscreen ? 'absolute' : 'static'}
      top="0px"
      left="0px"
    >
      {!isFullscreen && <SearchBar limit={5} />}
      <GraphToolBar onSubgoalFilter={filterSubgoals} onUnlockNodes={setUnlockNodes} />
      <Flex h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} unlockAllNodes={unlockNodes} />
        <GraphDescriptions />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
