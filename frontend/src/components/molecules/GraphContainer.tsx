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
import { CorrelationFilter } from '../../types/generalTypes';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);
  const [unlockNodes, setUnlockNodes] = useState<boolean>(false);
  const [edgeLabelsVisible, setEdgeLabelsVisible] = useState<boolean>(true);
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);
  const [correlationFilterValues, setCorrelationFilterValues] = useState<CorrelationFilter>({
    pLow: true,
    pMedium: true,
    pHigh: true,
    nLow: true,
    nMedium: true,
    nHigh: true,
  });

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };
  const edgeFilter = (edge: D3Edge | GraphEdge): boolean => {
    if (
      !isWithinCorrelationLimit(
        edge,
        correlationFilterValues.pLow,
        correlationFilterValues.pMedium,
        correlationFilterValues.pHigh,
        correlationFilterValues.nLow,
        correlationFilterValues.nMedium,
        correlationFilterValues.nHigh,
      )
    )
      return false;
    return true;
  };

  return (
    <Stack
      spacing={isFullscreen ? 0 : 2}
      h={isFullscreen ? '100vh' : '65vh'}
      w={isFullscreen ? '100vw' : ''}
      position={isFullscreen ? 'absolute' : 'static'}
    >
      <GraphToolBar
        onSubgoalFilter={filterSubgoals}
        correlationFilterValues={setCorrelationFilterValues}
        onUnlockNodes={setUnlockNodes}
        onEdgeLabelsVisible={setEdgeLabelsVisible}
      />
      <Flex h="100%" justify="space-between">
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
