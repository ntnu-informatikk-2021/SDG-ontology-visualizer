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

interface ContextDividerProps {
  visible: boolean;
}

const ContextDivider: React.FC<ContextDividerProps> = ({ visible }: ContextDividerProps) => {
  if (!visible) return <></>;
  return (
    <Center mx="20">
      <Divider orientation="vertical" />
    </Center>
  );
};

interface AllConnectionsProps {
  contributions: Array<Node>;
  tradeOffs: Array<Node>;
  developmentAreas: Array<Node>;
  onClick: (connection: Node) => void;
}

const AllConnections: React.FC<AllConnectionsProps> = ({
  contributions,
  tradeOffs,
  developmentAreas,
  onClick,
}: AllConnectionsProps) => (
  <Stack spacing={5}>
    <Connections
      connections={contributions}
      titles={['Har positiv virkning til:', 'Har ingen etablerte positive påvirkninger enda']}
      color="green"
      onClick={onClick}
    />
    <Connections
      connections={tradeOffs}
      titles={['Har negativ virkning til:', 'Har ingen etablerte negative påvirkninger enda']}
      color="red"
      onClick={onClick}
    />
    <Connections
      connections={developmentAreas}
      titles={['Har utviklingsområde til:', 'Har ingen utviklingsområder']}
      color="blue"
      onClick={onClick}
    />
  </Stack>
);

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
        <SlideInDrawer expanded={!expanded} width="40vw">
          <Text fontSize="xl" mt="2">
            {annotations.description}
          </Text>
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
          <>
            <Heading as="h3">
              {`${annotations.label} har ${
                selectedConnection && mapCorrelationToName(selectedConnection.correlation)
              } korrelasjon til ${selectedConnection && selectedConnection.name}`}
            </Heading>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti porro saepe
              laboriosam iure amet, atque, id ex asperiores tempora voluptatem totam necessitatibus.
              A maiores laboriosam, pariatur earum perferendis distinctio dicta?
            </Text>
            <IconButton
              aria-label="Close connection view"
              onClick={() => setExpanded(false)}
              colorScheme="blue"
              icon={<ArrowRightIcon />}
            />
          </>
        </SlideInDrawer>
      </Flex>
    </Box>
  );
};

DetailView.defaultProps = { node: undefined };
export default DetailView;
