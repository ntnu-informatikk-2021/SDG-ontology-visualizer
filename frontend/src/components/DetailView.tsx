import React, { useEffect, useState } from 'react';
import { Box, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { getAnnontations } from '../api/ontologies';
import { Annontations, Node } from '../types/ontologyTypes';

const data2 = {
  label: 'Bærekraftsmål navn',
  description: 'beskrivelse',
  isSDGoff: ['subGoal1', 'subGoal2', 'subGoal3'],
};

type Props = {
  node: Node;
};

const DetailView: React.FC<Props> = ({ node }) => {
  const [annotations, setAnnotations] = useState<Annontations>({ label: '', description: '' });

  const loadAnnontations = async () => {
    const data = await getAnnontations(node.id);
    setAnnotations(data);
  };

  useEffect(() => {
    loadAnnontations();
  }, []);

  return (
    <Box bg="tomato" w="100%" p={4} color="white">
      <div>{annotations.label}</div>
      <div>{annotations.description}</div>
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
