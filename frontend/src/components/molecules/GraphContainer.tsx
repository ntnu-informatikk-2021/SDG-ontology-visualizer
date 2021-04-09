import React, { useState } from 'react';
import { Flex, Stack } from '@chakra-ui/react';
import Graph from '../atoms/Graph';
import GraphSidebar from '../atoms/GraphSidebar';
import { isSubgoal } from '../../common/node';
import { GraphNode } from '../../types/ontologyTypes';
import SearchBar from '../atoms/SearchBar';

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
    <Stack bg="gray.400" h="80vh" spacing="10" p="10">
      <SearchBar limit={5} />
      <Flex h="100%" justify="space-between">
        <Graph nodeFilter={nodeFilter} />
        <GraphSidebar onSubgoalFilter={filterSubgoals} />
      </Flex>
    </Stack>
  );
};

export default GraphContainer;
