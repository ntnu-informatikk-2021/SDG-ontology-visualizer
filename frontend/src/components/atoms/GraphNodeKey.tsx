import React from 'react';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { GoPrimitiveDot } from 'react-icons/go';
import { changeColorBasedOnType } from '../../common/d3';

type GraphNodeKeyProps = {
  description: string;
};

const GraphNodeKey: React.FC<GraphNodeKeyProps> = ({ description }: GraphNodeKeyProps) => (
  <Flex align="center">
    <Icon as={GoPrimitiveDot} w={12} h={12} color={changeColorBasedOnType(description)} />
    <Text fontSize="sm">{description}</Text>
  </Flex>
);

export default GraphNodeKey;
