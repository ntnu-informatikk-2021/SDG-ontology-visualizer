import { Flex, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { GoPrimitiveDot } from 'react-icons/go';

type GraphNodeKeyProps = {
  color: string;
  description: string;
};

const GraphNodeKey = ({ color, description }: GraphNodeKeyProps) => (
  <Flex align="center">
    <Icon as={GoPrimitiveDot} w={10} h={10} color={color} />
    <Text>{description}</Text>
  </Flex>
);

export default GraphNodeKey;
