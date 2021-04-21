import React from 'react';
import { MenuItem, Checkbox } from '@chakra-ui/react';

interface CheckboxProps {
  text: string;
  index: number;
  onChange: (index: number) => void;
}
const CorrelationCheckbox: React.FC<CheckboxProps> = ({ text, index, onChange }: CheckboxProps) => (
  <MenuItem
    _hover={{
      bg: '#A1E3F0',
    }}
  >
    <Checkbox
      width="100%"
      height="100%"
      type="checkbox"
      defaultIsChecked
      color="white"
      size="lg"
      onChange={() => onChange(index)}
    >
      {text}
    </Checkbox>
  </MenuItem>
);

export default CorrelationCheckbox;
