import React, { useState } from 'react';
import {
  Text,
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react';
import { mapCorrelationToName } from '../../common/node';
import { capitalize } from '../../common/other';

interface Props {
  onChange: (value: number) => void;
  color: string;
  bgColor: string;
  text: string;
}

const CorrelationSlider: React.FC<Props> = ({ onChange, color, bgColor, text }: Props) => {
  const [value, setValue] = useState<number>(3);

  const onChangeSlider = (newValue: number): void => {
    setValue(newValue);
    onChange(newValue);
  };

  const formattedText = `${`${capitalize(mapCorrelationToName(4 - value))}` || 'Ingen'} ${text}`;

  return (
    <Stack>
      <Text size="lg" color="gray.200">
        {formattedText}
      </Text>
      <Slider
        mt="0 !important"
        w="200px"
        defaultValue={3}
        min={0}
        max={3}
        step={1}
        onChangeEnd={onChangeSlider}
      >
        <SliderTrack bg={bgColor}>
          <Box position="relative" right={4} />
          <SliderFilledTrack bg={color} />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </Stack>
  );
};

export default CorrelationSlider;
