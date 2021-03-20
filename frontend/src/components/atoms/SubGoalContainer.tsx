import { Box, Container, Heading } from '@chakra-ui/react';
import React from 'react';
import { SubGoal } from '../../types/ontologyTypes';

type SubGoalContainerProps = {
  subGoalNode: SubGoal;
};

const SubGoalContainer: React.FC<SubGoalContainerProps> = ({
  subGoalNode,
}: SubGoalContainerProps) => (
  <Container>
    <Box>
      <Heading as="h3" size="md" my="4">
        {subGoalNode.label}
      </Heading>
      <p>{subGoalNode.description}</p>
    </Box>
  </Container>
);

export default SubGoalContainer;
