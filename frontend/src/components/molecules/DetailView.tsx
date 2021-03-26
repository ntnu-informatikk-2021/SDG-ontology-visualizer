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
