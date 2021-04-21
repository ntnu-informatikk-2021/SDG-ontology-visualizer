import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getDevelopmentArea,
  getTradeOff,
} from '../../api/ontologies';
import { mapCorrelationToName } from '../../common/node';
import { isUrl } from '../../common/regex';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';
import ContextDivider from '../atoms/ContextDivider';
import SlideInDrawer from '../atoms/SlideInDrawer';
import AllConnections from './AllConnections';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
    moreInformation: '',
  });
  const [objectAnnotations, setObjectAnnotations] = useState<Annotation>({
    label: '',
    description: '',
    moreInformation: '',
  });

  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedConnection, setSelectedConnection] = useState<Node>();
  const [selectedPredicate, setSelectedPredicate] = useState<Array<string>>();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  const clearData = () => {
    setAnnotations(undefined);
    setObjectAnnotations(undefined);
    setContributions([]);
    setTradeOffs([]);
    setDevelopmentAreas([]);
  };

  const loadData = async () => {
    if (!selectedNode) return;
    clearData();
    let newAnnotations;
    let newContributions = [];
    let newTradeOffs = [];
    let newDevelopmentAreas = [];
    await Promise.allSettled([
      (newAnnotations = await getAnnotations(selectedNode.id)),
      (newContributions = await getContributions(selectedNode.id)),
      (newTradeOffs = await getTradeOff(selectedNode.id)),
      (newDevelopmentAreas = await getDevelopmentArea(selectedNode.id)),
    ]);
    setAnnotations(newAnnotations);
    setContributions(newContributions);
    setTradeOffs(newTradeOffs);
    setDevelopmentAreas(newDevelopmentAreas);
  };

  const loadObjectPropertyAnnotations = async () => {
    if (!selectedPredicate) return;
    setObjectAnnotations(await getAnnotations(selectedPredicate[1]));
  };

  const expandConnection = async (connection: Node, predicate: Array<string>) => {
    setSelectedConnection(connection);
    setSelectedPredicate(predicate);
    setExpanded(true);
  };

  const onClickConnections = (node: Node) => {
    setExpanded(false);
    if (selectedNode && selectedNode.id !== node.id) {
      dispatch(selectNode(node));
    }
  };

  useEffect(() => {
    loadData();
    onClickConnections(selectedNode!);
  }, [selectedNode]);

  useEffect(() => {
    loadObjectPropertyAnnotations();
  }, [selectedPredicate]);

  return (
    <Box bg="cyan.700" py={8} px={[4, null, null, 8]} color="white" rounded="lg">
      <Heading as="h2" size="lg" pb="2">
        {annotations.label.toUpperCase() || (selectedNode && selectedNode.name) || 'Mangler navn'}
      </Heading>
      <Flex justify="space-between">
        <SlideInDrawer expanded={!expanded} width="40vw">
          <>
            <Text fontSize="lg" mt="2">
              {annotations.description
                ? annotations.description
                : 'Dette konseptet er under utvikling '}
            </Text>
            {annotations.moreInformation && (
              <Text fontSize="base" mt="2">
                Mer informasjon finnes her:
                {'  '}
                {isUrl(annotations.moreInformation) ? (
                  <Link href={annotations.moreInformation} isExternal fontWeight="bold">
                    {annotations.moreInformation}
                  </Link>
                ) : (
                  annotations.moreInformation
                )}
              </Text>
            )}
          </>
        </SlideInDrawer>
        <ContextDivider visible={!expanded} />
        <AllConnections
          contributions={contributions}
          tradeOffs={tradeOffs}
          developmentAreas={developmentAreas}
          onClick={expandConnection}
        />
        <ContextDivider visible={expanded} />
        <SlideInDrawer expanded={expanded} width="40vw">
          <Stack spacing="5">
            <Heading as="h2" size="lg">
              {annotations.label}
              <Heading size="lg" color="cyan.200">
                {selectedPredicate &&
                  selectedPredicate[0] &&
                  `har ${
                    selectedConnection && mapCorrelationToName(selectedConnection.correlation)
                  } ${selectedPredicate[0]} til`}
              </Heading>
              {selectedConnection && selectedConnection.name}
            </Heading>
            <Text fontSize="md" mt="2">
              {`Relasjonen "${objectAnnotations && objectAnnotations.label}" er en
                ${objectAnnotations && objectAnnotations.description} `}
            </Text>
            <ButtonGroup>
              <Button
                bg="white"
                color="cyan.700"
                size="sm"
                onClick={() => onClickConnections(selectedConnection!)}
              >
                {`Gå til 
              ${selectedConnection && selectedConnection.name}`}
              </Button>
              <Button
                aria-label="Lukk korrelasjonsvisning"
                size="sm"
                onClick={() => setExpanded(false)}
                bg="white"
                color="cyan.700"
                rightIcon={<ArrowForwardIcon />}
              >
                Lukk
              </Button>
            </ButtonGroup>
          </Stack>
        </SlideInDrawer>
      </Flex>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
