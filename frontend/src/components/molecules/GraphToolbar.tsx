import { Button, Checkbox, HStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import CorrelationSlider from '../atoms/CorrelationSlider';
import SearchBar from '../atoms/SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onPositiveConnectionFilter: React.Dispatch<React.SetStateAction<number>>;
  onNegativeConnectionFilter: React.Dispatch<React.SetStateAction<number>>;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
  onEdgeLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onPositiveConnectionFilter,
  onNegativeConnectionFilter,
  onUnlockNodes,
  onEdgeLabelsVisible,
}: GraphToolBarProps) => {
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);
  return (
    <HStack bg="cyan.500" borderRadius={isFullscreen ? 'none' : 'lg'} p="2" spacing="10">
      <SearchBar limit={5} />
      <Checkbox color="white" size="md" checked onChange={onSubgoalFilter}>
        Vis delmål
      </Checkbox>
      <Checkbox
        defaultIsChecked
        color="white"
        size="md"
        onChange={() => onEdgeLabelsVisible((current) => !current)}
      >
        Vis kanttekst
      </Checkbox>
      <CorrelationSlider
        text="positiv påvirkning"
        color="green"
        bgColor="green.100"
        onChange={(value) => onPositiveConnectionFilter(3 - value)}
      />
      <CorrelationSlider
        text="negativ påvirkning"
        color="tomato"
        bgColor="red.100"
        onChange={(value) => onNegativeConnectionFilter(3 - value)}
      />
      <Button
        size="sm"
        bg="white"
        color="cyan.600"
        onClick={() => onUnlockNodes((current) => !current)}
      >
        Lås opp noder
      </Button>
    </HStack>
  );
};

export default GraphToolBar;
