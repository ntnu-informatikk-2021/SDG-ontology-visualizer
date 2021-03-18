import React, { useEffect, useState } from 'react';
import { Box, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { getAnnotations } from '../../api/ontologies';
import { Annotation, Node } from '../../types/ontologyTypes';

/**
 * This is mock data and should be changed to use actual data.
 */

const mockData = {
  label: 'Bærekraftsmål navn',
  description: 'beskrivelse',
  isSDGoff: ['subGoal1', 'subGoal2', 'subGoal3'],
};

type DetailViewProps = {
  node: Node;
};

const DetailView: React.FC<DetailViewProps> = ({ node }: DetailViewProps) => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });

  const loadAnnotations = async () => {
    const data = await getAnnotations(node.id);
    setAnnotations(data);
  };

  useEffect(() => {
    loadAnnotations();
  }, []);

  return (
    <Box bg="tomato" w="100%" p={6} color="white">
      <div>{annotations.label}</div>
      <div>{annotations.description}</div>
      <div>
        <p style={{ display: 'inline' }}>Har bidrag til</p>
        {mockData.isSDGoff.map((relation) => (
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
                  <MenuItem
                    style={{ color: 'red' }}
                    onClick={() => console.log('Navigating to details')}
                  >
                    Se detaljer
                  </MenuItem>
                  <MenuItem
                    style={{ color: 'red' }}
                    onClick={() => console.log('Navigating to graph')}
                  >
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
