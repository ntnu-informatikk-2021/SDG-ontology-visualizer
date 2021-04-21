import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Checkbox, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';
import { CorrelationFilter } from '../../types/generalTypes';

interface Props {
  onChangeCorrelation: React.Dispatch<React.SetStateAction<CorrelationFilter>>;
  positive: boolean;
}

const CorrelationDropdown = ({ onChangeCorrelation, positive }: Props) => (
  <Menu closeOnSelect={false} closeOnBlur autoSelect={false}>
    <MenuButton as={Button} color="cyan.600" rightIcon={<ChevronDownIcon />}>
      {positive ? 'Positiv ' : 'Negativ '}
      virkninger
    </MenuButton>
    <MenuList bg="cyan.500">
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
          onChange={() => {
            if (positive) {
              onChangeCorrelation((current) => ({
                ...current,
                pLow: !current.pLow,
              }));
            } else {
              onChangeCorrelation((current) => ({
                ...current,
                nLow: !current.nLow,
              }));
            }
          }}
        >
          Lav
        </Checkbox>
      </MenuItem>
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
          onChange={() => {
            if (positive) {
              onChangeCorrelation((current) => ({
                ...current,
                pMedium: !current.pMedium,
              }));
            } else {
              onChangeCorrelation((current) => ({
                ...current,
                nMedium: !current.nMedium,
              }));
            }
          }}
        >
          Moderat
        </Checkbox>
      </MenuItem>
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
          onChange={() => {
            if (positive) {
              onChangeCorrelation((current) => ({
                ...current,
                pHigh: !current.pHigh,
              }));
            } else {
              onChangeCorrelation((current) => ({
                ...current,
                nHigh: !current.nHigh,
              }));
            }
          }}
        >
          Høy
        </Checkbox>
      </MenuItem>
    </MenuList>
  </Menu>
);

export default CorrelationDropdown;
