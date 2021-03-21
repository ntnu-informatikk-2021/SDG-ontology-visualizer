import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getTradeOff,
  getDevelopmentArea,
} from '../../api/ontologies';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();

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

  const onClickConnections = (node: Node) => {
    dispatch(selectNode(node));
  };

  useEffect(() => {
    loadAnnotations();
    loadContributions();
    loadTradeOff();
    loadDevelopmentArea();
  }, [selectedNode]);

  return (
    <Box bg="tomato" w="100%" p={6} color="white">
      <Container w="60%" maxW="1000px">
        <Heading as="h2" size="2xl" fontWeight="hairline">
          {annotations.label.toUpperCase() || (selectedNode && selectedNode.name) || ''}
        </Heading>
        <Heading as="h3" size="md" my="4">
          {annotations.description}
        </Heading>
        <Text>{contributions.length ? 'Har bidrag til' : 'Har ingen bidrag'}</Text>
        {contributions.map((contribution) => (
          <Button
            onClick={() => onClickConnections(contribution)}
            colorScheme="blue"
            style={{ margin: 5 }}
            key={contribution.id}
          >
            {contribution.name}
          </Button>
        ))}
        <Text>{tradeOffs.length ? 'Har Tradeoff til' : 'Har ingen Tradeoff'}</Text>
        {tradeOffs.map((tradeoff) => (
          <Button
            onClick={() => onClickConnections(tradeoff)}
            colorScheme="blue"
            style={{ margin: 5 }}
            key={tradeoff.id}
          >
            {tradeoff.name}
          </Button>
        ))}
        <Text>
          {developmentAreas.length ? 'Har utviklingsområde til' : 'Har ingen utviklingsområder'}
        </Text>
        {developmentAreas.map((developmentArea) => (
          <Button
            onClick={() => onClickConnections(developmentArea)}
            colorScheme="blue"
            style={{ margin: 5 }}
            key={developmentArea.id}
          >
            {developmentArea.name}
          </Button>
        ))}
      </Container>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
