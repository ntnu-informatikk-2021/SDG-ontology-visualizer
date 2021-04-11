import { Box, Button } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineFullscreen } from 'react-icons/ai';
import { getRelations } from '../../api/ontologies';
import GraphSimulation from '../../d3/GraphSimulation';
import useWindowDimensions from '../../hooks/useWindowsDimensions';
import { setError } from '../../state/reducers/apiErrorReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { GraphNodeFilter } from '../../types/d3/simulation';
import { GraphNode } from '../../types/ontologyTypes';

type GraphProps = {
  nodeFilter: GraphNodeFilter;
};

const Graph: React.FC<GraphProps> = ({ nodeFilter }: GraphProps) => {
  const { height, width } = useWindowDimensions();
  const svgRef = useRef<SVGSVGElement>(null);
  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();
  const [simulation, setSimulation] = useState<GraphSimulation>();

  const loadData = async () => {
    if (!simulation || !selectedNode) return;

    const ontologies = await getRelations(selectedNode.id);
    simulation.addData(ontologies, selectedNode);
  };

  const onExpandNode = (node: GraphNode): void => {
    if (selectedNode && selectedNode.id === node.id) {
      loadData();
    } else {
      dispatch(selectNode(node));
    }
  };

  useEffect(() => {
    if (simulation) simulation.updateOnClickCallback(onExpandNode);
  }, [onExpandNode]);

  useEffect(() => {
    if (!svgRef || !svgRef.current) return;
    if (!selectedNode) {
      dispatch(setError(new Error('No nodes selected in Graph')));
      return;
    }
    if (!simulation) {
      setSimulation(
        new GraphSimulation(
          svgRef.current,
          0.4 * width,
          0.4 * height,
          selectedNode,
          onExpandNode,
          nodeFilter,
        ),
      );
    } else {
      loadData();
    }
  }, [selectedNode, svgRef, simulation]);

  useEffect(() => {
    if (simulation) simulation.setNodeFilter(nodeFilter);
  }, [nodeFilter]);

  return (
    <Box position="relative" bg="white" borderRadius="lg" width="80vw">
      <svg id="svgGraph" height="100%" width="100%" ref={svgRef} />
      <Button
        position="absolute"
        right="0px"
        bottom="0px"
        bgColor="transparent"
        onClick={() => console.log('clicked fullscreen button')}
      >
        <AiOutlineFullscreen fontSize="32px" />
      </Button>
    </Box>
  );
};

export default Graph;
