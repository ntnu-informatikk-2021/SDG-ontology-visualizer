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
import setBrowserPosition from '../../common/setBrowserPositionToDetailView';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';
import ContextDivider from '../atoms/ContextDivider';
import SlideInDrawer from '../atoms/SlideInDrawer';
import AllConnections from './AllConnections';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    moreInformation: '',
    description: '',
  });
  const [objectAnnotations, setObjectAnnotations] = useState<Annotation>();
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedConnection, setSelectedConnection] = useState<Node>();
  const [selectedPredicate, setSelectedPredicate] = useState<Array<string>>();
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  /*
    Promise wrappers for API calls. To use Promise.allSettled (in order to get parallel API calls) in promises with function parameters, the function calls had to be wrapped in an async function. While this clutters the code a bit, the alternative would be to make sequential API calls, effectively quadrupling the time API delay for the DetailView. 
  */
  const setAnnotationsPromise = async (node: Node): Promise<void> => {
    setAnnotations(await getAnnotations(node.id));
  };
  const setContributionsPromise = async (node: Node): Promise<void> => {
    setContributions(await getContributions(node.id));
  };
  const setTradeOffsPromise = async (node: Node): Promise<void> => {
    setTradeOffs(await getTradeOff(node.id));
  };
  const setDevelopmentAreasPromise = async (node: Node): Promise<void> => {
    setDevelopmentAreas(await getDevelopmentArea(node.id));
  };

  const loadData = async () => {
    if (!selectedNode) return;
    await Promise.allSettled([
      setAnnotationsPromise(selectedNode),
      setContributionsPromise(selectedNode),
      setTradeOffsPromise(selectedNode),
      setDevelopmentAreasPromise(selectedNode),
    ]);
    setIsLoading(false);
    if (!hasInitialized) {
      setHasInitialized(true);
    } else {
      setBrowserPosition();
    }
  };

  const loadObjectPropertyAnnotations = async () => {
    if (!selectedPredicate) return;
    setObjectAnnotations(undefined);
    setObjectAnnotations(await getAnnotations(selectedPredicate[1]));
    setIsLoading(false);
  };

  const expandConnection = async (connection: Node, predicate: Array<string>) => {
    setIsLoading(true);
    setSelectedConnection(connection);
    setSelectedPredicate(predicate);
    setExpanded(true);
  };

  const onClickConnections = (node: Node) => {
    setIsLoading(true);
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

  useEffect(() => {
    setHasInitialized(false);
  }, []);

  return (
    <Box id="detailView" bg="cyan.700" py={8} px={[4, null, null, 8]} color="white" rounded="lg">
      <Heading as="h2" size="lg" pb="2">
        {isLoading
          ? 'Laster...'
          : annotations.label.toUpperCase() ||
            (selectedNode && selectedNode.name) ||
            'Mangler navn'}
      </Heading>
      <Flex visibility={isLoading ? 'hidden' : 'visible'} justify="space-between">
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
              {objectAnnotations && objectAnnotations.description
                ? `Relasjonen "${objectAnnotations && objectAnnotations.label}" er en
                ${objectAnnotations && objectAnnotations.description} `
                : 'Laster...'}
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
