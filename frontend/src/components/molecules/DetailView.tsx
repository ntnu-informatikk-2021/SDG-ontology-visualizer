import { Box, Container, Heading } from '@chakra-ui/react';
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

  const loadAnnotations = async () => {
    if (!selectedNode) return;
    const data = await getAnnotations(selectedNode.id);
    setAnnotations(data);
  };

  const loadContributions = async () => {
    if (!selectedNode) return;
    const data = await getContributions(selectedNode.id);
    setContributions(data);
  };

  const loadTradeOff = async () => {
    if (!selectedNode) return;
    const data = await getTradeOff(selectedNode.id);
    setTradeOffs(data);
  };

  const loadDevelopmentArea = async () => {
    if (!selectedNode) return;
    const data = await getDevelopmentArea(selectedNode.id);
    setDevelopmentAreas(data);
  };

  useEffect(() => {
    loadAnnotations();
    loadContributions();
    loadTradeOff();
    loadDevelopmentArea();
  }, [selectedNode]);

  return (
    <Box bg="cyan.600" w="100%" p={6} color="white">
      <Container w="60%" maxW="1000px">
        <Heading as="h2" size="2xl" fontWeight="hairline">
          {annotations.label.toUpperCase() || (selectedNode && selectedNode.name) || ''}
        </Heading>
        <Heading as="h3" size="md" my="4">
          {annotations.description}
        </Heading>
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
      </Container>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
