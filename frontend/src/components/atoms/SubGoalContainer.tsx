import { Container, Heading, Text } from '@chakra-ui/react';
import React from 'react';
import { SubGoal } from '../../types/ontologyTypes';

type SubGoalContainerProps = {
  subGoalNode: SubGoal;
};

const SubGoalContainer: React.FC<SubGoalContainerProps> = ({
  subGoalNode,
}: SubGoalContainerProps) => (
  <Container bg="cyan.400" color="white" borderRadius="md" boxShadow="lg">
    <Heading as="h3" size="md" my="4">
      {subGoalNode.SubjectLabel}
    </Heading>
    <Text>{subGoalNode.description}</Text>
  </Container>
);

export default SubGoalContainer;
