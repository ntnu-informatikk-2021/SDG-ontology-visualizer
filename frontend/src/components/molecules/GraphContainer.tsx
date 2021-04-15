import { Flex, Stack } from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { isSubgoal } from '../../common/node';
import FullscreenContext from '../../context/FullscreenContext';
import { GraphNode } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphToolBar from '../atoms/GraphToolbar';
import GraphDescriptions from './GraphDescriptions';

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
      h={isFullscreen ? '100vh' : '65vh'}
      w={isFullscreen ? '100vw' : ''}
      position={isFullscreen ? 'absolute' : 'static'}
      top="0px"
      left="0px"
    >
      <GraphToolBar onSubgoalFilter={filterSubgoals} onUnlockNodes={setUnlockNodes} />
      {/* chakra adds implicit margin because it's a child of a stack, so we must use !important */}
      <Flex mt={isFullscreen ? '0 !important' : ''} h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} unlockAllNodes={unlockNodes} />
        <GraphDescriptions />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
