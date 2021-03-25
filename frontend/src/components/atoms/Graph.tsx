import { Center } from '@chakra-ui/react';
import { D3ZoomEvent, select, Simulation, zoom } from 'd3';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getRelations } from '../../api/ontologies';
import {
  makePredicateUnique,
  mapNodeToGraphNode,
  mapOntologyToGraphEdge,
  removeDuplicates,
} from '../../common/d3';
import {
  createForceSimulation,
  drawLinks,
  drawNodeLabels,
  drawNodes,
  resetSimulation,
  updateLabelPositions,
  updateLinkPositions,
  updateNodePositions,
} from '../../d3/d3';
import { setError } from '../../state/reducers/apiErrorReducer';
import { selectNode } from '../../state/reducers/ontologyReducer';
import { RootState } from '../../state/store';
import { D3Edge, GraphEdge, GraphNode, Ontology } from '../../types/ontologyTypes';

const Graph: React.FC = () => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const svgref = useRef<SVGSVGElement>(null);
  const linksRef = useRef<SVGGElement>(null);
  const nodesRef = useRef<SVGGElement>(null);
  const edgeLabelsRef = useRef<SVGGElement>(null);
  const nodeLabelsRef = useRef<SVGGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<Array<GraphEdge | D3Edge>>([]);
  const [forceSim, setForceSim] = useState<Simulation<GraphNode, GraphEdge>>();

  const selectedNode = useSelector((state: RootState) => state.ontology.selectedNode);

  const dispatch = useDispatch();

  const updateNodes = (ontologies: Array<Ontology>, clickedNode: GraphNode) => {
    let newNodes = ontologies.map((ontology) =>
      ontology.Subject.id === clickedNode.id ? ontology.Object : ontology.Subject,
    );

    if (hasInitialized) {
      newNodes = nodes.concat(newNodes);
    } else {
      newNodes.push(clickedNode as GraphNode);
    }
    newNodes = newNodes
      .filter(removeDuplicates)
      .map((node) => mapNodeToGraphNode(node, clickedNode));

    setNodes(newNodes);
  };

  const updateLinks = (ontologies: Array<Ontology>) => {
    let newLinks: Array<GraphEdge | D3Edge> = ontologies
      .map(makePredicateUnique)
      .map(mapOntologyToGraphEdge);
    if (hasInitialized) {
      newLinks = links.concat(newLinks);
    }
    newLinks = newLinks.filter(removeDuplicates);

    console.log(newLinks.map((link) => link.source));
    setLinks(newLinks);
  };

  const loadData = async () => {
    if (!selectedNode) {
      dispatch(setError(new Error('No nodes selected in Graph')));
      return;
    }
    if (!hasInitialized) {
      setHasInitialized(true);
    }

    const ontologies = await getRelations(selectedNode.id);
    if (ontologies.length === 0) {
      if (!hasInitialized) {
        setHasInitialized(false);
      }
      return;
    }

    updateNodes(ontologies, selectedNode);
    updateLinks(ontologies);
  };

  const onClickNode = (node: GraphNode) => {
    dispatch(selectNode(node));
  };

  const drawGraph = () => {
    if (!nodes || !links || nodes.length === 0 || links.length === 0) return;

    // const svg = select(svgref.current);
    const svgLinks = select(linksRef.current);
    const svgNodes = select(nodesRef.current);
    // const svgLinkLabels = select(linksRef.current);
    const svgNodeLabels = select(nodeLabelsRef.current);

    drawLinks(svgLinks, links, '.link', 'none', '#aaa', 1);
    drawNodes(
      svgLinks,
      svgNodes,
      nodes,
      '.node',
      10,
      '#4299e1',
      '#322659',
      onClickNode,
      links,
      forceSim,
    );
    drawNodeLabels(svgNodeLabels, nodes, '.nodeLabel');
    // drawEdgeLabels(svg, links, '.edgeLabel');

    // TODO: Simplify this
    if (forceSim) {
      forceSim.on('tick', () => {
        updateLinkPositions(svgLinks, links, '.link');
        updateNodePositions(svgNodes, nodes, '.node');
        updateLabelPositions(svgNodeLabels, nodes, '.nodeLabel');
        // updateEdgeLabelPositions(svg, links, '.edgeLabel');
      });
      resetSimulation(forceSim, nodes, links);
    } else {
      const newForceSim = createForceSimulation(nodes, links).on('tick', () => {
        // console.log(newForceSim.alpha());
        updateLinkPositions(svgLinks, links, '.link');
        updateNodePositions(svgNodes, nodes, '.node');
        updateLabelPositions(svgNodeLabels, nodes, '.nodeLabel');
        // updateEdgeLabelPositions(svg, links, '.edgeLabel');
      });
      setForceSim(newForceSim);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedNode]);

  useEffect(() => {
    console.log('nodes or links changed');
    drawGraph();
  }, [links]);

  // Does only change the transform values of each g element.
  useEffect(() => {
    // const zoom:ZoomBehavior<SVGSVGElement, any> = () => {}
    const svg = select(svgref.current);
    const svgLinks = select(linksRef.current);
    const svgNodes = select(nodesRef.current);
    const svgLinkLabels = select(edgeLabelsRef.current);
    const svgNodeLabels = select(nodeLabelsRef.current);
    const rect = document.getElementById('svgGraph')!.getBoundingClientRect(); // or other selector like querySelector()

    svg.call(
      zoom()
        .on('zoom', (event: D3ZoomEvent<SVGSVGElement, any>) => {
          const scale = event.transform.k;
          const translate = [event.transform.x, event.transform.y];
          console.log(translate);
          console.log(rect);
          svgLinks.attr('transform', `translate(${translate}) scale(${scale})`);
          svgNodes.attr('transform', `translate(${translate}) scale(${scale})`);
          svgLinkLabels.attr('transform', `translate(${translate}) scale(${scale})`);
          svgNodeLabels.attr('transform', `translate(${translate}) scale(${scale})`);
        })
        .scaleExtent([0.2, 4]) as any,
    );
  }, []);

  return (
    <Center mx="auto" my="0">
      <svg
        // viewBox={`0 0 ${500 / zoomVar} ${800 / zoomVar}`}
        id="svgGraph"
        height="500px"
        width="100%"
        ref={svgref}
      >
        <g ref={linksRef} />
        <g ref={nodesRef} />
        <g ref={edgeLabelsRef} />
        <g ref={nodeLabelsRef} />
      </svg>
    </Center>
  );
};
Graph.defaultProps = { initialNode: undefined };
export default Graph;
