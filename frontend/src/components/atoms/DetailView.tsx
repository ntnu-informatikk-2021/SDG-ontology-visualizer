import { Box, Button, Container, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnnotations, getSDGAndTBLContributions } from '../../api/ontologies';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();

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

  const onClickContribution = (node: Node) => {
    dispatch(selectNode(node));
  };

  useEffect(() => {
    loadAnnotations();
    loadSDGContributions();
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
            onClick={() => onClickContribution(contribution)}
            colorScheme="blue"
            style={{ margin: 5 }}
            key={contribution.id}
          >
            {contribution.name}
          </Button>
        ))}
      </Container>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
