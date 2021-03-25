import { Box, Button, Container, Heading, SimpleGrid, Text, Wrap } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getDevelopmentArea,
  getTradeOff,
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
        <Box>
          <Text>
            {contributions.length
              ? 'Har positiv virkning til'
              : 'Har ingen etablerte positive påvirkninger enda'}
          </Text>
          <Wrap>
            {contributions.map((contribution) => (
              <Button
                onClick={() => onClickConnections(contribution)}
                colorScheme="green"
                bg="green.400"
                style={{ margin: 5 }}
                key={contribution.id}
              >
                {contribution.name}
              </Button>
            ))}
          </Wrap>
          <Text>
            {tradeOffs.length
              ? 'Har negativ virkning til'
              : 'Har ingen etablerte negative påvirkninger enda'}
          </Text>
          <Wrap>
            {tradeOffs.map((tradeoff) => (
              <Button
                onClick={() => onClickConnections(tradeoff)}
                colorScheme="red"
                style={{ margin: 5 }}
                key={tradeoff.id}
              >
                {tradeoff.name}
              </Button>
            ))}
          </Wrap>
          <Text>
            {developmentAreas.length ? 'Har utviklingsområde til' : 'Har ingen utviklingsområder'}
          </Text>
          <Wrap>
            {developmentAreas.map((developmentArea) => (
              <Button
                onClick={() => onClickConnections(developmentArea)}
                _hover={{ backgroundColor: 'blue.800' }}
                bg="blue.600"
                style={{ margin: 5 }}
                key={developmentArea.id}
              >
                {developmentArea.name}
              </Button>
            ))}
          </Wrap>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
