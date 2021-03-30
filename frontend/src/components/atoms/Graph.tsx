import { Center } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRelations } from '../../api/ontologies';
import GraphSimulation from '../../d3/GraphSimulation';
import useWindowDimensions from '../../hooks/useWindowsDimensions';
import { setError } from '../../state/reducers/apiErrorReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { GraphNode } from '../../types/ontologyTypes';

const Graph: React.FC = () => {
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

  const onClickNode = (node: GraphNode): void => {
    dispatch(selectNode(node));
  };

  useEffect(() => {
    if (!svgRef || !svgRef.current) return;
    if (!selectedNode) {
      dispatch(setError(new Error('No nodes selected in Graph')));
      return;
    }
    if (!simulation) {
      setSimulation(
        new GraphSimulation(svgRef.current, width, height - 200, selectedNode, onClickNode),
      );
    } else {
      loadData();
    }
  }, [selectedNode, svgRef, simulation]);

  return (
    <Center mx="auto" my="0">
      <svg id="svgGraph" height={height - 200} width={width} ref={svgRef} />
    </Center>
  );
};

export default Graph;
