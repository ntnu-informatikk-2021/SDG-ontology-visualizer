import React, { useEffect, useState } from 'react';
import { Box, Menu, MenuButton, Button, MenuList, MenuItem } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getAnnotations, getSDGAndTBLContributions } from '../../api/ontologies';
import { Annotation, Node } from '../../types/ontologyTypes';
import { RootState } from '../../state/store';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>();
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  const loadAnnotations = async () => {
    if (!selectedNode) return;
    const data = await getAnnotations(selectedNode.id);
    setAnnotations(data);
  };

  const loadSDGContributions = async () => {
    if (!selectedNode) return;
    const data = await getSDGAndTBLContributions(selectedNode.id);
    setContributions(data);
  };

  useEffect(() => {
    loadAnnotations();
    loadSDGContributions();
  }, [selectedNode]);

  return (
    <Box bg="tomato" w="100%" p={6} color="white">
      <div>{annotations.label}</div>
      <div>{annotations.description}</div>
      <div>
        <p style={{ display: 'inline' }}>Har bidrag til</p>
        {contributions &&
          contributions.map((contribution) => (
            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    key={contribution.id}
                    colorScheme="blue"
                    style={{ margin: 5 }}
                    isActive={isOpen}
                    as={Button}
                  >
                    {contribution.name}
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

DetailView.defaultProps = { node: undefined };
export default DetailView;
