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
  text: string;
}

const CorrelationSlider: React.FC<Props> = ({ onChange, text }: Props) => {
  const [value, setValue] = useState<number>(3);

  const onChangeSlider = (newValue: number): void => {
    setValue(newValue);
    onChange(newValue);
  };

  const formattedText = `${`${capitalize(mapCorrelationToName(4 - value))}` || 'Ingen'} ${text}`;

  return (
    <Stack spacing="0.5" minWidth="65">
      <Text size="lg" color="white">
        {formattedText}
      </Text>
      <Slider defaultValue={3} min={0} max={3} step={1} onChangeEnd={onChangeSlider}>
        <SliderTrack>
          <Box position="relative" right={4} />
          <SliderFilledTrack bg="cyan.400" />
        </SliderTrack>
        <SliderThumb boxSize={4} />
      </Slider>
    </Stack>
  );
};

export default CorrelationSlider;
