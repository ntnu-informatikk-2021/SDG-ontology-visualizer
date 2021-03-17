import { Box, Container } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { getSustainabilityGoals } from '../api/ontologies';
import { Node, SustainabilityGoal } from '../types/ontologyTypes';

type DetailViewProps = {
  node: Node;
};
const TestView: React.FC<DetailViewProps> = ({ node }: DetailViewProps) => {
  const [sustainabilityGoals, setSustainabilityGoals] = useState<SustainabilityGoal>({
    instancesOf: '',
    label: '',
    icon: '',
  });

  const loadSustainabilityGoals = async () => {
    const data = await getSustainabilityGoals(node.id);
    setSustainabilityGoals(data);
  };

  useEffect(() => {
    loadSustainabilityGoals();
  }, []);
  return (
    <Container paddingTop={20} centerContent>
      <Box
        borderWidth="1g"
        borderRadius={5}
        p={0}
        w="150%"
        overflow="hidden"
        border="2px"
        borderColor="linkedin.400"
      >
        <p>{sustainabilityGoals.label}</p>
        <img src={sustainabilityGoals.icon} alt="fn.no" />
      </Box>
    </Container>
  );
};

export default TestView;
