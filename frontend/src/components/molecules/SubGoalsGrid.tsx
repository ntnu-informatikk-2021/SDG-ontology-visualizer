import { Box, Flex, Heading, Stack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getSubGoals } from '../../api/ontologies';
import { RootState } from '../../state/store';
import { SubGoal } from '../../types/ontologyTypes';
import SubGoalContainer from '../atoms/SubGoalContainer';

// component containing all subgoal and its information, can be found below DetailView if selected node is a SDG
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

  if (!subGoals || subGoals.length === 0) {
    return <Box height="200px" />;
  }

  return (
    <Box align="center" px="10">
      <Heading size="lg" mb="10" color="cyan.900">
        DELMÅL:
      </Heading>
      <Flex justify="space-evenly">
        <Stack width="45%" spacing="5">
          {subGoals.map(
            (subGoal, i) =>
              !(i % 2) && (
                <SubGoalContainer key={subGoal.name + i.toString()} subGoalNode={subGoal} />
              ),
          )}
        </Stack>
        <Stack width="45%" spacing="5">
          {subGoals.map(
            (subGoal, i) =>
              i % 2 && <SubGoalContainer key={subGoal.name + i.toString()} subGoalNode={subGoal} />,
          )}
        </Stack>
      </Flex>
    </Box>
  );
};

export default SubGoalsGrid;
