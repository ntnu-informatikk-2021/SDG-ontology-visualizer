import { Button, Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import SearchBar from '../atoms/SearchBar';
import CorrelationDropdown from './CorrelationDropdown';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
  onEdgeLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onUnlockNodes,
  onEdgeLabelsVisible,
}: GraphToolBarProps) => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);

  return (
    <HStack bg="cyan.700" borderRadius={isFullscreen ? 'none' : 'lg'} p="2" spacing="10">
      <SearchBar limit={5} />
      <Checkbox colorScheme="cyan" color="white" size="md" checked onChange={onSubgoalFilter}>
        Vis delmål
      </Checkbox>
      <Checkbox
        defaultIsChecked
        colorScheme="cyan"
        color="white"
        size="md"
        onChange={() => onEdgeLabelsVisible((current) => !current)}
      >
        Vis kanttekst
      </Checkbox>
      <CorrelationDropdown isPositive />
      <CorrelationDropdown isPositive={false} />
      <Button color="cyan.600" onClick={() => onUnlockNodes((current) => !current)}>
        Lås opp alle noder
      </Button>
    </HStack>
  );
};

export default GraphToolBar;
