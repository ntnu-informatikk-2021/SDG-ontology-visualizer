import {
  Box,
  Checkbox,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Button,
} from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import SearchBar from './SearchBar';

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
    <HStack bg="cyan.500" borderRadius={isFullscreen ? 'none' : 'lg'} p="2" spacing="5">
      <SearchBar limit={5} />
      <Checkbox color="white" size="lg" checked onChange={onSubgoalFilter}>
        Vis delmål
      </Checkbox>
      <Checkbox
        defaultIsChecked
        color="white"
        size="lg"
        onChange={() => onEdgeLabelsVisible((current) => !current)}
      >
        Vis kanttext
      </Checkbox>
      <Button onClick={() => onUnlockNodes((current) => !current)}>Lås opp alle noder</Button>
      <Slider
        defaultValue={3}
        min={0}
        max={3}
        step={1}
        onChangeEnd={(value) => onPositiveConnectionFilter(3 - value)}
      >
        <SliderTrack bg="green.100">
          <Box position="relative" right={4} />
          <SliderFilledTrack bg="green" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
      <Slider
        defaultValue={3}
        min={0}
        max={3}
        step={1}
        onChangeEnd={(value) => onNegativeConnectionFilter(3 - value)}
      >
        <SliderTrack bg="red.100">
          <Box position="relative" right={4} />
          <SliderFilledTrack bg="tomato" />
        </SliderTrack>
        <SliderThumb boxSize={6} />
      </Slider>
    </HStack>
  );
};

export default GraphToolBar;
