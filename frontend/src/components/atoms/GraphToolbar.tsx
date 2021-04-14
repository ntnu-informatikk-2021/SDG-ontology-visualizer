import {
  Box,
  Checkbox,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from '@chakra-ui/react';
import React from 'react';
import SearchBar from './SearchBar';

type GraphToolBarProps = {
  onSubgoalFilter: () => void;
  onPosetiveConnectionFilter: (value: number) => void;
};

const GraphToolBar: React.FC<GraphToolBarProps> = ({
  onSubgoalFilter,
  onPosetiveConnectionFilter,
}: GraphToolBarProps) => (
  <HStack bg="cyan.500" borderRadius="lg" p="2" spacing="5">
    <SearchBar limit={5} />
    <Checkbox color="white" size="lg" onChange={onSubgoalFilter}>
      Vis delmål
    </Checkbox>
    <Slider
      defaultValue={3}
      min={0}
      max={3}
      step={1}
      onChangeEnd={(value) => onPosetiveConnectionFilter(value)}
    >
      <SliderTrack bg="red.100">
        <Box position="relative" right={4} />
        <SliderFilledTrack bg="tomato" />
      </SliderTrack>
      <SliderThumb boxSize={6} />
    </Slider>
  </HStack>
);

export default GraphToolBar;
