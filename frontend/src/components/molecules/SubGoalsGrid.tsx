import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
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

  return subGoals.length ? (
    <Box align="center" px="10">
      <Heading size="2xl" mb="10" fontWeight="hairline" color="gray.800">
        DELMÅL:
      </Heading>
      <SimpleGrid columns={2} spacing={10}>
        {subGoals.map((subGoal) => (
          <SubGoalContainer key={subGoal.id} subGoalNode={subGoal} />
        ))}
      </SimpleGrid>
    </Box>
  ) : (
    <></>
  );
};

export default SubGoalsGrid;
