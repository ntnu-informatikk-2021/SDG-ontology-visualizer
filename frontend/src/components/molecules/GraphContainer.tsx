import React from 'react';
import { Flex } from '@chakra-ui/react';
import Graph from '../atoms/Graph';
import GraphSidebar from '../atoms/GraphSidebar';

const GraphContainer = () => (
  <Flex>
    <Graph />
    <GraphSidebar />
  </Flex>
);

export default GraphContainer;
