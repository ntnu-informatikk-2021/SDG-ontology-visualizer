import React, { useRef, useEffect, useState } from 'react';
import { select, Simulation } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../css/Graph.module.css';
import { GraphEdge, GraphNode } from '../../types/ontologyTypes';
import { getRelations } from '../../api/ontologies';
import {
  createForceSimulation,
  drawEdgeLabels,
  drawLinks,
  drawNodeLabels,
  drawNodes,
  resetSimulation,
  updateEdgeLabelPositions,
  updateLabelPositions,
  updateLinkPositions,
  updateNodePositions,
} from '../../d3/d3';
import { makePredicateUnique, mapOntologyToGraphEdge, removeDuplicates } from '../../common/d3';
import { RootState } from '../../state/store';
import { selectNode } from '../../state/reducers/ontologyReducer';

const Graph: React.FC = () => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const svgref = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphEdge[]>([]);
  const [forceSim, setForceSim] = useState<Simulation<GraphNode, GraphEdge>>();
  const initialNode = useSelector((state: RootState) => state.ontology.selectedNode);
  const dispatch = useDispatch();

  const loadInitialData = async () => {
    if (!initialNode || hasInitialized) return;
    setHasInitialized(true);

    const ontologies = await getRelations(initialNode.id);
    if (ontologies.length === 0) {
      setHasInitialized(false);
      return;
    }

    const newNodes: GraphNode[] = ontologies
      .map((ontology) =>
        ontology.Subject.id === initialNode.id ? ontology.Object : ontology.Subject,
      )
      .filter(removeDuplicates);
    newNodes.push(initialNode as GraphNode);

    setNodes(newNodes);

    const newLinks = ontologies.map(mapOntologyToGraphEdge);
    setLinks(newLinks);
  };

  const loadMoreData = async (node: GraphNode) => {
    const ontologies = await getRelations(node.id);
    if (ontologies.length === 0) return;

    const newNodes: GraphNode[] = nodes
      .concat(
        ontologies.map((ontology) =>
          ontology.Subject.id === node.id ? ontology.Object : ontology.Subject,
        ),
      )
      .filter(removeDuplicates);

    const newLinks = links
      .concat(ontologies.map(makePredicateUnique).map(mapOntologyToGraphEdge))
      .filter(removeDuplicates);

    setNodes(newNodes);
    setLinks(newLinks);

    dispatch(selectNode(node));
  };

  const drawGraph = () => {
    if (!nodes || !links || nodes.length === 0 || links.length === 0) return;

    const svg = select(svgref.current);

    drawLinks(svg, links, '.link', 'none', '#a03', 1);
    drawNodes(svg, nodes, '.node', 10, '#22a', '#22e', loadMoreData);
    drawNodeLabels(svg, nodes, '.nodeLabel');
    drawEdgeLabels(svg, links, '.edgeLabel');

    // TODO: Simplify this
    if (forceSim) {
      forceSim.on('tick', () => {
        updateLinkPositions(svg, links, '.link');
        updateNodePositions(svg, nodes, '.node');
        updateLabelPositions(svg, nodes, '.nodeLabel');
        updateEdgeLabelPositions(svg, links, '.edgeLabel');
      });
      resetSimulation(forceSim, nodes, links);
    } else {
      const newForceSim = createForceSimulation(nodes, links).on('tick', () => {
        updateLinkPositions(svg, links, '.link');
        updateNodePositions(svg, nodes, '.node');
        updateLabelPositions(svg, nodes, '.nodeLabel');
        updateEdgeLabelPositions(svg, links, '.edgeLabel');
      });
      setForceSim(newForceSim);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [initialNode]);

  useEffect(() => {
    drawGraph();
  }, [nodes, links]);

  return (
    <div>
      <svg className={styles.graph} ref={svgref} />
    </div>
  );
};
Graph.defaultProps = { initialNode: undefined };
export default Graph;
