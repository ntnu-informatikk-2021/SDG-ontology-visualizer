import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React from 'react';
import CorrelationCheckbox from '../atoms/CorrelationCheckbox';

interface Props {
  isPositive: boolean;
}

const CorrelationDropdown: React.FC<Props> = ({ isPositive }: Props) => (
  <Menu closeOnSelect={false} closeOnBlur autoSelect={false}>
    <MenuButton
      as={Button}
      bg="white"
      size="sm"
      color="cyan.700"
      minW="13.5em"
      rightIcon={<ChevronDownIcon />}
    >
      {isPositive ? 'Positive ' : 'Negative '}
      virkninger
    </MenuButton>
    <MenuList bg="cyan.700">
      <CorrelationCheckbox text="Lav" isPositive={isPositive} index={0} />
      <CorrelationCheckbox text="Moderat" isPositive={isPositive} index={1} />
      <CorrelationCheckbox text="Høy" isPositive={isPositive} index={2} />
    </MenuList>
  </Menu>
);

export default CorrelationDropdown;
