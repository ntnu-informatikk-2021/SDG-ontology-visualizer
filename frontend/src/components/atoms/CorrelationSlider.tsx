import React from 'react';
import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react';

interface Props {
  onChange: (value: number) => void;
  color: string;
  bgColor: string;
}

const CorrelationSlider: React.FC<Props> = ({ onChange, color, bgColor }: Props) => (
  <Slider defaultValue={3} min={0} max={3} step={1} onChangeEnd={onChange}>
    <SliderTrack bg={bgColor}>
      <Box position="relative" right={4} />
      <SliderFilledTrack bg={color} />
    </SliderTrack>
    <SliderThumb boxSize={6} />
  </Slider>
);

export default CorrelationSlider;
