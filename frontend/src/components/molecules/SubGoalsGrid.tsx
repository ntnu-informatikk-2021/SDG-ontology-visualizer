import React, { useEffect, useState } from 'react';
import { Box, Center, Heading, SimpleGrid } from '@chakra-ui/react';
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
    <Box mx="10%" my="5%">
      <Center mb="5%">
        <Heading as="h2" size="2xl" fontWeight="hairline" color="gray.800">
          DELMÅL:
        </Heading>
      </Center>
      <SimpleGrid columns={2} spacing={10}>
        {subGoals.map((subGoal) => (
          <SubGoalContainer key={subGoal.id} subGoalNode={subGoal} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default SubGoalsGrid;
