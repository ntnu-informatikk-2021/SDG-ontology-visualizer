import { Box, Center, Divider, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getDevelopmentArea,
  getTradeOff,
} from '../../api/ontologies';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';
import Connections from '../atoms/Connections';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  const loadData = async () => {
    if (!selectedNode) return;
    setAnnotations(await getAnnotations(selectedNode.id));
    setContributions(await getContributions(selectedNode.id));
    setTradeOffs(await getTradeOff(selectedNode.id));
    setDevelopmentAreas(await getDevelopmentArea(selectedNode.id));
  };

  useEffect(() => {
    loadData();
  }, [selectedNode]);

  return (
    <Box spacing={10} bg="cyan.500" w="100%" px={10} py={6} color="white">
      <Heading as="h2" size="2xl" fontWeight="hairline" textAlign="left" paddingBottom="5">
        {annotations.label.toUpperCase() || (selectedNode && selectedNode.name) || ''}
      </Heading>
      <Flex justify="space-between">
        <Text fontSize="xl" mt="2">
          {annotations.description}
        </Text>
        <Center mx="20">
          <Divider orientation="vertical" />
        </Center>
        <Stack spacing={5}>
          <Connections
            connections={contributions}
            titles={['Har positiv virkning til:', 'Har ingen etablerte positive påvirkninger enda']}
            color="green"
          />
          <Connections
            connections={tradeOffs}
            titles={['Har negativ virkning til:', 'Har ingen etablerte negative påvirkninger enda']}
            color="red"
          />
          <Connections
            connections={developmentAreas}
            titles={['Har utviklingsområde til:', 'Har ingen utviklingsområder']}
            color="blue"
          />
        </Stack>
      </Flex>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
