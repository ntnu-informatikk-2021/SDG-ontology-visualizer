import { Button, Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { CorrelationFilter } from '../../types/generalTypes';
import CorrelationDropdown from './CorrelationDropdown';
import SearchBar from '../atoms/SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  correlationFilterValues: React.Dispatch<React.SetStateAction<CorrelationFilter>>;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
  onEdgeLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  correlationFilterValues,
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
      <CorrelationDropdown positive onChangeCorrelation={correlationFilterValues} />
      <CorrelationDropdown positive={false} onChangeCorrelation={correlationFilterValues} />
      <Button color="cyan.600" onClick={() => onUnlockNodes((current) => !current)}>
        Lås opp alle noder
      </Button>
    </HStack>
  );
};

export default GraphToolBar;
