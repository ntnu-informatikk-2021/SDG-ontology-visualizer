import { Flex, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { isSubgoal, isConnection } from '../../common/node';
import { GraphNode, GraphEdge } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphDescriptions from './GraphDescriptions';
import { D3Edge } from '../../types/d3/simulation';
import GraphToolBar from '../atoms/GraphToolbar';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);
  const [PositiveConnectionChoice, setPositiveConnectionChoice] = useState<number>(0);
  const [NegativeConnectionChoice, setNegativeonnectionChoice] = useState<number>(0);
  const [unlockNodes, setUnlockNodes] = useState<boolean>(false);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const getPosetivConnectionChoice = (value: number): void => {
    setPositiveConnectionChoice(value);
  };
  const getNegativeConnectionChoice = (value: number): void => {
    setNegativeonnectionChoice(value);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };
  const edgeFilter = (edge: D3Edge | GraphEdge): boolean => {
    if (isConnection(edge, PositiveConnectionChoice, NegativeConnectionChoice)) return true;
    return false;
  };

  return (
    <Stack h="80vh">
      <GraphToolBar
        onSubgoalFilter={filterSubgoals}
        onPositiveConnectionFilter={getPosetivConnectionChoice}
        onNegativeConnectionFilter={getNegativeConnectionChoice}
        onUnlockNodes={setUnlockNodes}
      />
      <Flex h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} edgeFilter={edgeFilter} unlockAllNodes={unlockNodes} />
        <GraphDescriptions />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
