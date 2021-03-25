import { Box, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
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
    <Box spacing={10} bg="cyan.600" w="100%" p={6} color="white">
      <Heading as="h2" size="2xl" fontWeight="hairline" textAlign="center" paddingBottom="5">
        {annotations.label.toUpperCase() || (selectedNode && selectedNode.name) || ''}
      </Heading>
      <SimpleGrid columns={2}>
        <Container centerContent>
          <Text fontSize="xl" my="4">
            {annotations.description}
          </Text>
        </Container>
        <Connections
          connections={contributions}
          titles={['Har positiv virkning til', 'har ingen etablerte positive påvirkninger enda']}
        />
        <Connections
          connections={tradeOffs}
          titles={['Har negativ virkning til', 'Har ingen etablerte negative påvirkninger enda']}
        />
        <Connections
          connections={developmentAreas}
          titles={['Har utviklingsområde til', 'Har ingen utviklingsområder']}
        />
      </SimpleGrid>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
