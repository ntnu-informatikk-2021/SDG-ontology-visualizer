import React from 'react';
import { chakra, HTMLChakraProps, Image } from '@chakra-ui/react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { SustainabilityGoal } from '../../types/ontologyTypes';

type IconContainerProps = {
  sustainabilityNode: SustainabilityGoal;
  onClick: (sdg: SustainabilityGoal) => void;
};

// Makes framer motion compatible with Typescript
type Merge<P, T> = Omit<P, keyof T> & T;
type MotionBoxProps = Merge<HTMLChakraProps<'div'>, HTMLMotionProps<'div'>>;

export const MotionBox: React.FC<MotionBoxProps> = motion(chakra.div);

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
      overflow="hidden"
      alt={sustainabilityNode.label}
      boxSize="300"
    />
  </MotionBox>
);

export default IconContainer;
