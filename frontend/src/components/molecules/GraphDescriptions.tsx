import { Stack } from '@chakra-ui/react';
import React from 'react';
import GraphNodeKey from '../atoms/GraphNodeKey';

const GraphDescriptions: React.FC = () => (
  <Stack px="5">
    <GraphNodeKey color="#4299e1" description="Standardfarge/StartNode" />
    <GraphNodeKey color="#EA5F41" description="Bærekraftsmål" />
    <GraphNodeKey color="#85E664" description="Delmål til bærekraftsmål" />
    <GraphNodeKey color="#4299e1" description="Trippelbunnlinje" />
    <GraphNodeKey color="#DDA93B" description="Utviklingsområde" />
  </Stack>
);

export default GraphDescriptions;
