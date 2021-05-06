import { Box, IconButton } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { GiContract, GiExpand } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';
import { getRelations } from '../../api/ontologies';
import GraphSimulation from '../../d3/GraphSimulation';
import useWindowDimensions from '../../hooks/useWindowsDimensions';
import { setError } from '../../state/reducers/apiErrorReducer';
import { toggleFullscreen } from '../../state/reducers/fullscreenReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { GraphEdgeFilter, GraphNodeFilter } from '../../types/d3/simulation';
import { GraphNode } from '../../types/ontologyTypes';

type GraphProps = {
  nodeFilter: GraphNodeFilter;
  edgeFilter: GraphEdgeFilter;
  unlockAllNodes: boolean;
  edgeLabelsVisible: boolean;
};

const Graph: React.FC<GraphProps> = ({
  nodeFilter,
  edgeFilter,
  unlockAllNodes,
  edgeLabelsVisible,
}: GraphProps) => {
  const { height, width } = useWindowDimensions();
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();
  const [simulation, setSimulation] = useState<GraphSimulation>();
  const { isFullscreen } = useSelector((state: RootState) => state.fullscreenStatus);
  const [hasInitialized, setHasInitialized] = useState(false);

  const loadData = async (node: GraphNode) => {
    if (!simulation) return;
    const ontologies = await getRelations(node.id);
    simulation.addData(ontologies, node);
  };

  // callback triggered when expand button is clicked in node menu
  const onExpandNode = (node: GraphNode): void => {
    loadData(node);
  };

  // callback triggered when information button is clicked in node menu
  const onSelectNode = (node: GraphNode): void => {
    dispatch(selectNode(node));
  };

  const createNewGraphSimulation = () => {
    if (!svgRef || !svgRef.current || !selectedNode) return;
    setSimulation(
      new GraphSimulation(
        svgRef.current,
        0.4 * width,
        0.4 * height,
        selectedNode,
        onExpandNode,
        onSelectNode,
        nodeFilter,
        edgeFilter,
      ),
    );
  };

  useEffect(() => {
    if (simulation) simulation.updateOnExpandCallback(onExpandNode);
  }, [onExpandNode]);

  // Useeffect to initialize the graph simulation and to add more data as it is received from the API
  useEffect(() => {
    if (!svgRef || !svgRef.current) return;
    if (!selectedNode) {
      dispatch(setError(new Error('Du har ikke valgt en node i grafen')));
      return;
    }
    if (!simulation) {
      createNewGraphSimulation();
    } else if (!hasInitialized) {
      setHasInitialized(true);
      loadData(selectedNode);
    }
  }, [selectedNode, svgRef, simulation]);

  useEffect(() => {
    if (simulation) {
      simulation.setNodeFilter(nodeFilter);
      simulation.setEdgeFilter(edgeFilter);
    }
  }, [nodeFilter, edgeFilter]);

  useEffect(() => {
    if (simulation) simulation.unlockAllNodes();
  }, [unlockAllNodes]);

  useEffect(() => {
    if (simulation) simulation.toggleEdgeLabelsVisibility();
  }, [edgeLabelsVisible]);

  return (
    <Box
      position="relative"
      bg="white"
      boxShadow="md"
      rounded="lg"
      width={isFullscreen ? '100vw' : ['70vw', '70vw', '75vw', '77vw', '75vw']}
    >
      <svg id="svgGraph" height="100%" width="100%" ref={svgRef} />
      <IconButton
        aria-label="Fullskjerm"
        color="cyan.700"
        size="lg"
        position="absolute"
        right="4"
        bottom="4"
        colorScheme="gray"
        onClick={() => dispatch(toggleFullscreen())}
        zIndex={1}
        icon={isFullscreen ? <GiContract size="40" /> : <GiExpand size="40" />}
      />
    </Box>
  );
};

export default Graph;
