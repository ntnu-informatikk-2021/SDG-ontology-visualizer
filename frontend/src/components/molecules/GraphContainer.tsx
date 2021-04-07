import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import Graph from '../atoms/Graph';
import GraphSidebar from '../atoms/GraphSidebar';
import { GraphEdge } from '../../types/ontologyTypes';
import { D3Edge } from '../../types/d3/simulation';

const GraphContainer: React.FC = () => {
  const [showSubgoals, setShowSubgoals] = useState<Boolean>(true);

  const filterSubgoals = () => {
    setShowSubgoals(!showSubgoals);
  };

  const filterGraph = (edge: GraphEdge | D3Edge) => {
    if (!showSubgoals) {
      return !edge.sourceToTarget.every(
        (e) => e.name.includes('harBærekraftsmål') || e.name.includes('erBærekraftsmålTil'),
      );
    }
    return true;
  };

  return (
    <Flex>
      <Graph onFilter={filterGraph} />
      <GraphSidebar onSubgoalFilter={filterSubgoals} />
    </Flex>
  );
};

export default GraphContainer;
