import { Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSubGoals } from '../../api/ontologies';
import { RootState } from '../../state/store';
import { SubGoal } from '../../types/ontologyTypes';
import SubGoalContainer from '../atoms/SubGoalContainer';

const SubGoalsGrid = () => {
  const [subGoals, setSubGoals] = useState<Array<SubGoal>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  const loadSubGoal = async () => {
    if (!selectedNode) return;
    const data = await getSubGoals(selectedNode.id);
    setSubGoals(data);
  };

  useEffect(() => {
    loadSubGoal();
  }, [selectedNode]);

  return (
    <Stack align="center">
      <Heading as="h2" size="2xl" fontWeight="hairline">
        DELMÅL:
      </Heading>
      <SimpleGrid columns={2} spacing={10}>
        {subGoals.map((subGoal) => (
          <SubGoalContainer subGoalNode={subGoal} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default SubGoalsGrid;
