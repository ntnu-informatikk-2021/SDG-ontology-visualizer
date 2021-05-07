import React from 'react';
import { Image } from '@chakra-ui/react';
import { SustainabilityGoal } from '../../types/ontologyTypes';
import { MotionBox } from '../../types/react/componentTypes';

type IconContainerProps = {
  sustainabilityNode: SustainabilityGoal;
  onClick: (sdg: SustainabilityGoal) => void;
};

const IconContainer: React.FC<IconContainerProps> = ({
  sustainabilityNode,
  onClick,
}: IconContainerProps) => (
  <MotionBox
    p={0}
    whileHover={{ scale: 1.05 }}
    _hover={{
      cursor: 'pointer',
    }}
    onClick={() => onClick(sustainabilityNode)}
  >
    <Image
      src={sustainabilityNode.icon}
      borderRadius="lg"
      overflow="hidden"
      alt={sustainabilityNode.label}
      boxSize="250"
      object-fit="cover"
    />
  </MotionBox>
);

export default IconContainer;
