import { Flex, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { isSubgoal, isPosetiveConnection } from '../../common/node';
import { GraphNode, GraphEdge } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphDescriptions from './GraphDescriptions';
import { D3Edge } from '../../types/d3/simulation';
import GraphToolBar from '../atoms/GraphToolbar';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);
  const [showPosetiveConnectionChoice, setPosetiveConnectionChoice] = useState<number>(3);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const getPosetivConnectionChoice = (value: number): void => {
    setPosetiveConnectionChoice(value);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };
  const edgeFilter = (edge: D3Edge | GraphEdge): boolean => {
    if (isPosetiveConnection(edge, showPosetiveConnectionChoice)) return false;
    return true;
  };

  return (
    <Stack h="80vh">
      <GraphToolBar
        onSubgoalFilter={filterSubgoals}
        onPosetiveConnectionFilter={getPosetivConnectionChoice}
      />
      <Flex h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} edgeFilter={edgeFilter} />
        <GraphDescriptions />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
