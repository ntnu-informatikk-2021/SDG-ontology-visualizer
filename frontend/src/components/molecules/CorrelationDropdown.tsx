import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuList } from '@chakra-ui/react';
import React from 'react';
import { CorrelationFilter } from '../../types/generalTypes';
import CorrelationCheckbox from '../atoms/CorrelationCheckbox';

interface Props {
  onChangeCorrelation: React.Dispatch<React.SetStateAction<CorrelationFilter>>;
  positive: boolean;
}

const CorrelationDropdown: React.FC<Props> = ({ onChangeCorrelation, positive }: Props) => {
  const onChange = (checkboxIndex: number) => {
    onChangeCorrelation((current) => {
      const newCorrelationFilter = current;
      if (positive && checkboxIndex === 0) newCorrelationFilter.pLow = !current.pLow;
      else if (positive && checkboxIndex === 1) newCorrelationFilter.pMedium = !current.pMedium;
      else if (positive && checkboxIndex === 2) newCorrelationFilter.pHigh = !current.pHigh;
      else if (!positive && checkboxIndex === 0) newCorrelationFilter.nLow = !current.nLow;
      else if (!positive && checkboxIndex === 1) newCorrelationFilter.nMedium = !current.nMedium;
      else if (!positive && checkboxIndex === 2) newCorrelationFilter.nHigh = !current.nHigh;
      return newCorrelationFilter;
    });
  };

  return (
    <Menu closeOnSelect={false} closeOnBlur autoSelect={false}>
      <MenuButton as={Button} color="cyan.600" rightIcon={<ChevronDownIcon />}>
        {positive ? 'Positiv ' : 'Negativ '}
        virkninger
      </MenuButton>
      <MenuList bg="cyan.700">
        <CorrelationCheckbox text="Lav" index={0} onChange={onChange} />
        <CorrelationCheckbox text="Moderat" index={1} onChange={onChange} />
        <CorrelationCheckbox text="Høy" index={2} onChange={onChange} />
      </MenuList>
    </Menu>
  );
};

export default CorrelationDropdown;
