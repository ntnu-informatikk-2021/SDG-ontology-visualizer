import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { SubGoal } from '../../types/ontologyTypes';

type SubGoalContainerProps = {
  subGoalNode: SubGoal;
};

const SubGoalContainer: React.FC<SubGoalContainerProps> = ({
  subGoalNode,
}: SubGoalContainerProps) => (
  <Accordion allowToggle>
    <AccordionItem bg="cyan.700" color="white" borderRadius="md">
      <AccordionButton>
        <Heading as="h3" size="md">
          {subGoalNode.SubjectLabel}
        </Heading>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
        <Text>{subGoalNode.description}</Text>
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
);

export default SubGoalContainer;
