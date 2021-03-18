import { Center, SimpleGrid } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSustainabilityGoals } from '../../api/ontologies';
import { mapIdToNode } from '../../common/node';
import { setError } from '../../state/reducers/apiErrorReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
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
  const dispatch = useDispatch();

  const loadSustainabilityGoals = async () => {
    const data = await getSustainabilityGoals(sustainabilityNode.id);
    setSustainabilityGoals(data);
  };

  useEffect(() => {
    loadSustainabilityGoals();
  }, []);

  const onClickSDG = (sdg: SustainabilityGoal) => {
    const node = mapIdToNode(sdg.instancesOf);
    if (!node) {
      dispatch(setError(new Error('Could not map sustainability goal to node')));
      return;
    }
    dispatch(selectNode(node));
  };

  return (
    <Center>
      <SimpleGrid columns={2} spacing={10}>
        {sustainabilityGoals &&
          sustainabilityGoals.map((sdg) => (
            <Link to="/ontology">
              <IconContainer onClick={onClickSDG} sustainabilityNode={sdg} />
            </Link>
          ))}
      </SimpleGrid>
    </Center>
  );
};
export default SustainabilityGoalsList;
