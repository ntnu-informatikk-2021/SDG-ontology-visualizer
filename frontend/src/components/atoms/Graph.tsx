import React, { useRef, useEffect, useState } from 'react';
import { select, Simulation } from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../../css/Graph.module.css';
import { GraphEdge, GraphNode, Ontology } from '../../types/ontologyTypes';
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
import { setError } from '../../state/reducers/apiErrorReducer';

const Graph: React.FC = () => {
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const svgref = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphEdge[]>([]);
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
    newNodes = newNodes.filter(removeDuplicates);

    setNodes(newNodes);
  };

  const updateLinks = (ontologies: Array<Ontology>) => {
    let newLinks = ontologies.map(makePredicateUnique).map(mapOntologyToGraphEdge);
    if (hasInitialized) {
      newLinks = links.concat(newLinks);
    }
    newLinks = newLinks.filter(removeDuplicates);

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

    const svg = select(svgref.current);

    drawLinks(svg, links, '.link', 'none', '#a03', 1);
    drawNodes(svg, nodes, '.node', 10, '#22a', '#22e', onClickNode);
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
    loadData();
  }, [selectedNode]);

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
