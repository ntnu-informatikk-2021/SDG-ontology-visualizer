import React from 'react';
import { Box, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';

const data = {
  label: 'Bærekraftsmål navn',
  description: 'beskrivelse',
  isSDGoff: ['subGoal1', 'subGoal2', 'subGoal3'],
};

const option = {
  option1: '',
  option2: '',
};

const DetailView: React.FC = () => {
  const data2 = data;
  console.log(option);

  return (
    <Box bg="tomato" w="100%" p={4} color="white">
      <div>{data2.label}</div>
      <div>{data2.description}</div>
      <div>
        <p style={{ display: 'inline' }}>Har bidrag til</p>
        {data2.isSDGoff.map((relation) => (
          <Menu>
            {({ isOpen }) => (
              <>
                <MenuButton
                  key={relation}
                  colorScheme="blue"
                  style={{ margin: 5 }}
                  isActive={isOpen}
                  as={Button}
                >
                  {relation}
                  {isOpen ? '' : ''}
                </MenuButton>
                <MenuList>
                  <MenuItem style={{ color: 'red' }} onClick={() => alert('Går til detaljer')}>
                    Se detaljer
                  </MenuItem>
                  <MenuItem style={{ color: 'red' }} onClick={() => alert('Går til graf')}>
                    Se graf
                  </MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
        ))}
      </div>
    </Box>
  );
};

export default DetailView;
