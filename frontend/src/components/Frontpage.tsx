import React, { useState, useEffect } from 'react';
import { Center, SimpleGrid } from '@chakra-ui/react';
import IconContainer from './IconContainer';
import { getSustainabilityGoals } from '../api/ontologies';
import { Node, SustainabilityGoal } from '../types/ontologyTypes';

// Initial node displayed on the frontpage
const sustainabilityNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'SDG',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#SDG',
};

const Frontpage = () => {
  const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal[]>([
    {
      instancesOf: '',
      label: '',
      icon: '',
    },
  ]);

  const loadSustainabilityGoals = async () => {
    const data: SustainabilityGoal[] = await getSustainabilityGoals(sustainabilityNode.id);
    setSustainabilityGoals(data);
  };

  useEffect(() => {
    loadSustainabilityGoals();
  }, []);

  return (
    <Center>
      <SimpleGrid columns={2} spacing={10}>
        {sustainabilityGoals.map((sustainabilityGoal) => (
          <IconContainer sustainabilityNode={sustainabilityGoal} />
        ))}
      </SimpleGrid>
    </Center>
  );
};

export default Frontpage;
