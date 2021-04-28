import { Stack } from '@chakra-ui/react';
import React from 'react';
import GraphNodeKey from '../atoms/GraphNodeKey';

interface GraphDescriptionsProps {
  float: boolean;
}
// component for node description related to the graph
const GraphDescriptions: React.FC<GraphDescriptionsProps> = ({ float }: GraphDescriptionsProps) => (
  <Stack
    width={[null, null, null, '20vw', '17vw']}
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
