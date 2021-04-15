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
import SearchBar from './SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onPositiveConnectionFilter: (value: number) => void;
  onNegativeConnectionFilter: (value: number) => void;
  onUnlockNodes: React.Dispatch<React.SetStateAction<boolean>>;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onPositiveConnectionFilter,
  onNegativeConnectionFilter,
  onUnlockNodes,
}: GraphToolBarProps) => (
  <HStack bg="cyan.500" borderRadius="lg" p="2" spacing="5">
    <SearchBar limit={5} />
    <Checkbox color="white" size="lg" checked onChange={onSubgoalFilter}>
      Vis delmål
    </Checkbox>
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
    <Button onClick={() => onUnlockNodes((current) => !current)}>Lås opp alle noder</Button>
  </HStack>
);

export default GraphToolBar;
