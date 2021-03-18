import { Center, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSustainabilityGoals } from '../../api/ontologies';
import { parseNameFromClassId, parsePrefixFromClassId } from '../../common/node';
import { Node, SustainabilityGoal } from '../../types/ontologyTypes';
import IconContainer from '../atoms/IconContainer';

// Initial node displayed on the frontpage
const sustainabilityNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'SDG',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#SDG',
};

const SustainabilityGoalsList: React.FC = () => {
  const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal[]>();

  const loadSustainabilityGoals = async () => {
    const data = await getSustainabilityGoals(sustainabilityNode.id);
    setSustainabilityGoals(data);
  };

  useEffect(() => {
    loadSustainabilityGoals();
  }, []);

  return (
    <Center>
      <SimpleGrid columns={2} spacing={10}>
        {sustainabilityGoals &&
          sustainabilityGoals.map((sustainabilityGoal) => {
            const prefix = parsePrefixFromClassId(sustainabilityGoal.instancesOf);
            const name = parseNameFromClassId(sustainabilityGoal.instancesOf);
            if (!prefix || !name) return <></>;
            return (
              <Link to={`/ontology/${prefix.prefix}/${name}`}>
                <IconContainer sustainabilityNode={sustainabilityGoal} />
              </Link>
            );
          })}
      </SimpleGrid>
    </Center>
  );
};
export default SustainabilityGoalsList;
