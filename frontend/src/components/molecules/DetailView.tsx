import { ArrowRightIcon } from '@chakra-ui/icons';
import { Box, Center, Divider, Flex, Heading, IconButton, Stack, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getAnnotations,
  getContributions,
  getDevelopmentArea,
  getTradeOff,
} from '../../api/ontologies';
import { mapCorrelationToName } from '../../common/node';
import { RootState } from '../../state/store';
import { Annotation, Node } from '../../types/ontologyTypes';
import Connections from '../atoms/Connections';
import SlideInDrawer from '../atoms/SlideInDrawer';

const DetailView: React.FC = () => {
  const [annotations, setAnnotations] = useState<Annotation>({
    label: '',
    description: '',
  });
  const [contributions, setContributions] = useState<Array<Node>>([]);
  const [tradeOffs, setTradeOffs] = useState<Array<Node>>([]);
  const [developmentAreas, setDevelopmentAreas] = useState<Array<Node>>([]);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [selectedConnection, setSelectedConnection] = useState<Node>();

  const loadData = async () => {
    if (!selectedNode) return;
    setAnnotations(await getAnnotations(selectedNode.id));
    setContributions(await getContributions(selectedNode.id));
    setTradeOffs(await getTradeOff(selectedNode.id));
    setDevelopmentAreas(await getDevelopmentArea(selectedNode.id));
  };

  const expandConnection = (connection: Node) => {
    setSelectedConnection(connection);
    setExpanded(true);
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
        <SlideInDrawer expanded={!expanded}>
          <Box w="40vw">
            <Text fontSize="xl" mt="2">
              {annotations.description}
            </Text>
          </Box>
        </SlideInDrawer>
        {!expanded && (
          <Center mx="20">
            <Divider orientation="vertical" />
          </Center>
        )}
        <Stack spacing={5}>
          <Connections
            connections={contributions}
            titles={['Har positiv virkning til:', 'Har ingen etablerte positive påvirkninger enda']}
            color="green"
            onClick={expandConnection}
          />
          <Connections
            connections={tradeOffs}
            titles={['Har negativ virkning til:', 'Har ingen etablerte negative påvirkninger enda']}
            color="red"
            onClick={expandConnection}
          />
          <Connections
            connections={developmentAreas}
            titles={['Har utviklingsområde til:', 'Har ingen utviklingsområder']}
            color="blue"
            onClick={expandConnection}
          />
        </Stack>
        {expanded && (
          <Center mx="20">
            <Divider orientation="vertical" />
          </Center>
        )}
        <SlideInDrawer expanded={expanded}>
          <>
            <Center mx="20">
              <Divider orientation="vertical" />
            </Center>
            <Box w="40vw">
              <Heading as="h3">
                {`Har ${
                  selectedConnection && mapCorrelationToName(selectedConnection.correlation)
                }  korrelasjon`}
              </Heading>
              <Text>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint itaque odit
                dignissimos eligendi, quaerat, minima sed quas incidunt ratione deserunt non neque
                nulla soluta expedita nemo consectetur officiis quidem! Fuga?
              </Text>
              <IconButton
                aria-label="Close connection view"
                onClick={() => setExpanded(false)}
                colorScheme="blue"
                icon={<ArrowRightIcon />}
              />
            </Box>
          </>
        </SlideInDrawer>
      </Flex>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
