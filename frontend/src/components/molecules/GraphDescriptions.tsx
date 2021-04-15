import { Stack } from '@chakra-ui/react';
import React from 'react';
import GraphNodeKey from '../atoms/GraphNodeKey';

const GraphDescriptions: React.FC = () => (
  <Stack px="5">
    <GraphNodeKey description="Standardfarge/StartNode" />
    <GraphNodeKey description="SDG (Bærekraftsmål)" />
    <GraphNodeKey description="Delmål til bærekraftsmål" />
    <GraphNodeKey description="Trippel bunnlinje" />
    <GraphNodeKey description="Utviklingsområde" />
  </Stack>
);

export default GraphDescriptions;
