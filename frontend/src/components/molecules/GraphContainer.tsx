import { Flex, Stack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { isSubgoal } from '../../common/node';
import { GraphNode } from '../../types/ontologyTypes';
import Graph from '../atoms/Graph';
import GraphDescriptions from './GraphDescriptions';
import GraphToolBar from '../atoms/GraphToolbar';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<boolean>(false);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const nodeFilter = (node: GraphNode): boolean => {
    if (!showSubgoals && isSubgoal(node)) return false;
    return true;
  };

  return (
    <Stack h="80vh">
      <GraphToolBar onSubgoalFilter={filterSubgoals} />
      <Flex h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} />
        <GraphDescriptions />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
