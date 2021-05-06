import { SimpleGrid, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getSustainabilityGoals } from '../../api/ontologies';
import { mapSustainabilityGoalToNode } from '../../common/node';
import { setError } from '../../state/reducers/apiErrorReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { SustainabilityGoal } from '../../types/ontologyTypes';
import IconContainer from '../atoms/IconContainer';

const SustainabilityGoalsList: React.FC = () => {
  const [sustainabilityGoals, setSustainabilityGoals] = useState<Array<SustainabilityGoal>>();
  const dispatch = useDispatch();
  const history = useHistory();

  const loadSustainabilityGoals = async () => {
    const data = await getSustainabilityGoals();
    setSustainabilityGoals(data);
  };

  useEffect(() => {
    loadSustainabilityGoals();
  }, []);

  const onClickSDG = (sdg: SustainabilityGoal) => {
    const node = mapSustainabilityGoalToNode(sdg);
    if (!node) {
      dispatch(setError(new Error('Could not map sustainability goal to node')));
      return;
    }
    dispatch(selectNode(node));
  };

  return (
    <Stack align="center" spacing="20">
      <SimpleGrid columns={[2, 2, 3, null, 4]} spacing={10}>
        {sustainabilityGoals &&
          sustainabilityGoals.map((sdg) => (
            <IconContainer
              key={sdg.instancesOf}
              onClick={() => {
                onClickSDG(sdg);
                window.scrollTo(0, 0);
                history.push('/ontology');
              }}
              sustainabilityNode={sdg}
            />
          ))}
      </SimpleGrid>
    </Stack>
  );
};
export default SustainabilityGoalsList;
