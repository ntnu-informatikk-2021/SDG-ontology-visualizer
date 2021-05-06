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
import { useSelector } from 'react-redux';
import colorSwitcher from '../../common/colorSwitcher';
import { RootState } from '../../state/store';
import { SubGoal } from '../../types/ontologyTypes';

type SubGoalContainerProps = {
  subGoalNode: SubGoal;
};

const SubGoalContainer: React.FC<SubGoalContainerProps> = ({
  subGoalNode,
}: SubGoalContainerProps) => {
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  return (
    <Accordion allowToggle>
      <AccordionItem boxShadow="lg" borderRadius="md">
        <AccordionButton
          _expanded={{ borderBottomRadius: '0' }}
          borderRadius="md"
          bg={colorSwitcher(selectedNode! && selectedNode.id)}
          color="white"
          _hover={{ opacity: '75%' }}
        >
          <Heading as="h3" size="sm">
            {subGoalNode.SubjectLabel}
          </Heading>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          <Text fontSize="sm">{subGoalNode.description}</Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default SubGoalContainer;
