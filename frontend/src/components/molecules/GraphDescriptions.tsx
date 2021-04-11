import { Stack } from '@chakra-ui/react';
import React from 'react';
import GraphNodeKey from '../atoms/GraphNodeKey';

const GraphDescriptions: React.FC = () => (
  <Stack px="5">
    <GraphNodeKey color="#63B3ED" description="Standardfarge/StartNode" />
    <GraphNodeKey color="#D6BCFA" description="Bærekraftsmål" />
    <GraphNodeKey color="#FBD38D" description="Delmål til bærekraftsmål" />
    <GraphNodeKey color="#68D391" description="Trippelbunnlinje" />
    <GraphNodeKey color="#FC8181" description="Utviklingsområde" />
  </Stack>
);

export default GraphDescriptions;
