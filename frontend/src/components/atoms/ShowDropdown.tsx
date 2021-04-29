import { ChevronDownIcon } from '@chakra-ui/icons';
import { Box, Button, Checkbox, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import React from 'react';

type ShowDropdownProps = {
  onSubgoalFilter: () => void;
  onEdgeLabelsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};
const ShowDropdown = ({ onSubgoalFilter, onEdgeLabelsVisible }: ShowDropdownProps) => (
  <Box d={[null, null, null, 'flex', 'none']}>
    <Menu closeOnSelect={false} closeOnBlur autoSelect={false}>
      <MenuButton
        as={Button}
        size="sm"
        bg="white"
        color="cyan.700"
        minW="4em"
        rightIcon={<ChevronDownIcon />}
      >
        Vis
      </MenuButton>
      <MenuList bg="cyan.700">
        <MenuItem
          _hover={{
            bg: 'cyan.500',
          }}
        >
          <Checkbox
            width="100%"
            height="100%"
            colorScheme="cyan"
            color="white"
            size="md"
            checked
            onChange={onSubgoalFilter}
          >
            Vis delmål
          </Checkbox>
        </MenuItem>
        <MenuItem
          _hover={{
            bg: 'cyan.500',
          }}
        >
          <Checkbox
            width="100%"
            height="100%"
            defaultIsChecked
            colorScheme="cyan"
            color="white"
            size="md"
            onChange={() => onEdgeLabelsVisible((current) => !current)}
          >
            Vis kanttekst
          </Checkbox>
        </MenuItem>
      </MenuList>
    </Menu>
  </Box>
);

export default ShowDropdown;
