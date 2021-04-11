import { Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import SearchBar from './SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({ onSubgoalFilter }: GraphToolBarProps) => (
  <HStack bg="cyan.500" borderRadius="lg" p="2" spacing="5">
    <SearchBar limit={5} />
    <Checkbox color="white" size="lg" onChange={onSubgoalFilter}>
      Vis delmål
    </Checkbox>
  </HStack>
);

export default GraphToolBar;
