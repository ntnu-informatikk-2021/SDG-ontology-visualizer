import { Checkbox, Heading, Stack } from '@chakra-ui/react';
import React from 'react';

type GraphSidebarProps = {
  onSubgoalFilter: () => void;
};

const GraphSidebar: React.FC<GraphSidebarProps> = ({ onSubgoalFilter }: GraphSidebarProps) => (
  <Stack border="solid" borderColor="cyan.900" borderRadius="lg" p="5" w="20vw">
    <Heading as="h3">Filter</Heading>
    <Checkbox defaultIsChecked={false} onChange={onSubgoalFilter}>
      Vis delmål
    </Checkbox>
  </Stack>
);

export default GraphSidebar;
