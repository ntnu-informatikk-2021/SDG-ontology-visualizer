import { Flex, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { isSubgoal, isWithinCorrelationLimit } from '../../common/node';
import { RootState } from '../../state/store';
import { D3Edge } from '../../types/d3/simulation';
import { GraphEdge, GraphNode } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphToolBar from './GraphToolbar';
import GraphDescriptions from './GraphDescriptions';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);
  const [positiveConnectionChoice, setPositiveConnectionChoice] = useState<number>(0);
  const [negativeConnectionChoice, setNegativeConnectionChoice] = useState<number>(0);
  const [unlockNodes, setUnlockNodes] = useState<boolean>(false);
  const [edgeLabelsVisible, setEdgeLabelsVisible] = useState<boolean>(true);
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };
  const edgeFilter = (edge: D3Edge | GraphEdge): boolean => {
    if (!isWithinCorrelationLimit(edge, positiveConnectionChoice, negativeConnectionChoice))
      return false;
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
      <GraphToolBar
        onSubgoalFilter={filterSubgoals}
        onPositiveConnectionFilter={setPositiveConnectionChoice}
        onNegativeConnectionFilter={setNegativeConnectionChoice}
        onUnlockNodes={setUnlockNodes}
        onEdgeLabelsVisible={setEdgeLabelsVisible}
      />
      <Flex mt={isFullscreen ? '0 !important' : ''} h="100%" justify="space-between">
        <Graph
          nodeFilter={nodeFilter}
          edgeFilter={edgeFilter}
          unlockAllNodes={unlockNodes}
          edgeLabelsVisible={edgeLabelsVisible}
        />
        <GraphDescriptions float={isFullscreen} />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
