import { Stack } from '@chakra-ui/react';
import React from 'react';
import GraphNodeKey from '../atoms/GraphNodeKey';

interface GraphDescriptionsProps {
  float: boolean;
}

const GraphDescriptions: React.FC<GraphDescriptionsProps> = ({ float }: GraphDescriptionsProps) => (
  <Stack
    px="5"
    position={float ? 'absolute' : 'static'}
    right={0}
    bgColor="white"
    boxShadow="md"
    rounded="lg"
  >
    <GraphNodeKey description="Standardfarge/Startnode" />
    <GraphNodeKey description="SDG (Bærekraftsmål)" />
    <GraphNodeKey description="Delmål til bærekraftsmål" />
    <GraphNodeKey description="Trippel bunnlinje" />
    <GraphNodeKey description="Utviklingsområde" />
  </Stack>
);

export default GraphDescriptions;
