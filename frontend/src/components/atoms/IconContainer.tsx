import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { SustainabilityGoal } from '../../types/ontologyTypes';

type IconContainerProps = {
  sustainabilityNode: SustainabilityGoal;
  onClick: (sdg: SustainabilityGoal) => void;
};

const IconContainer: React.FC<IconContainerProps> = ({
  sustainabilityNode,
  onClick,
}: IconContainerProps) => (
  <Container paddingTop={20} centerContent>
    <Box
      borderWidth="1g"
      borderRadius={5}
      p={0}
      w="150%"
      overflow="hidden"
      border="2px"
      borderColor="linkedin.400"
      onClick={() => onClick(sustainabilityNode)}
    >
      <p>{sustainabilityNode.label}</p>
      <img src={sustainabilityNode.icon} alt="fn.no" />
    </Box>
  </Container>
);

export default IconContainer;
