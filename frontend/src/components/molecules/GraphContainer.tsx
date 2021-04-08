import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import Graph from '../atoms/Graph';
import GraphSidebar from '../atoms/GraphSidebar';
import { isSubgoal } from '../../common/node';
import { GraphNode } from '../../types/ontologyTypes';

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
    <Flex>
      <Graph nodeFilter={nodeFilter} />
      <GraphSidebar onSubgoalFilter={filterSubgoals} />
    </Flex>
  );
};

export default GraphContainer;
