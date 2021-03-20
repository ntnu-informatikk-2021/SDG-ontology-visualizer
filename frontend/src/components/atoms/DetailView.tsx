import { Box, Button, Container, Heading, SimpleGrid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getTradeOff,
  getDevelopmentArea,
  getSubGoals,
} from '../../api/ontologies';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { Annotation, Node, SubGoal } from '../../types/ontologyTypes';
import SubGoalContainer from './SubGoalContainer';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [subGoals, setSubGoals] = useState<Array<SubGoal>>([
    {
      id: '',
      label: '',
      description: '',
    },
  ]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();

  const loadAnnotations = async () => {
    if (!selectedNode) return;
    const data = await getAnnotations(selectedNode.id);
    setAnnotations(data);
  };

  const loadSubGoal = async () => {
    if (!selectedNode) return;
    const data = await getSubGoals(selectedNode.id);
    setSubGoals(data);
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
    loadSubGoal();
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
        <Text>
          {contributions.length
            ? 'Har positiv virkning til'
            : 'Har ingen etablerte positive påvirkninger enda'}
        </Text>
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
        <Text>
          {tradeOffs.length
            ? 'Har negativ virkning til'
            : 'Har ingen etablerte negative påvirkninger enda'}
        </Text>
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
        {subGoals.length ? (
          <Box>
            {/* Todo: put ${selectedNode?.name} */}
            <Heading as="h2" size="2xl" fontWeight="hairline">
              DELMÅL:
            </Heading>
            <SimpleGrid columns={2}>
              {subGoals.map((subGoal) => (
                <SubGoalContainer subGoalNode={subGoal} />
              ))}
            </SimpleGrid>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
