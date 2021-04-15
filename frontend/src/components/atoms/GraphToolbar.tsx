import { Button, Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import SearchBar from './SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onUnlockNodes,
}: GraphToolBarProps) => (
  <HStack bg="cyan.500" borderRadius="lg" p="2" spacing="5">
    <SearchBar limit={5} />
    <Checkbox color="white" size="lg" onChange={onSubgoalFilter}>
      Vis delmål
    </Checkbox>
    <Button onClick={() => onUnlockNodes((current) => !current)}>Lås opp alle noder</Button>
  </HStack>
);

export default GraphToolBar;
