import React, { useRef, useEffect, useState } from 'react';
import { select, Simulation } from 'd3';
import { GraphEdge, GraphNode, Node, Ontology } from '../types/ontologyTypes';
import { getRelations } from '../api/ontologies';
import {
  createForceSimulation,
  drawLinks,
  drawNodeLabels,
  drawNodes,
  resetSimulation,
  updateEdgeLabelPositions,
  updateLabelPositions,
  updateLinkPositions,
  updateNodePositions,
} from '../d3/d3';
import { makePredicateUnique, mapOntologyToGraphEdge, removeDuplicates } from '../common/d3';

const initialNode: Node = {
  prefix: {
    prefix: 'SDG',
    iri: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#',
  },
  name: 'Miljø',
  id: 'http://www.semanticweb.org/aga/ontologies/2017/9/SDG#Miljø',
};

const Graph: React.FC = () => {
  const svgref = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphEdge[]>([]);
  const [forceSim, setForceSim] = useState<Simulation<GraphNode, GraphEdge>>(
    (undefined as unknown) as Simulation<GraphNode, GraphEdge>,
  );

  const loadInitialData = async () => {
    console.log('loading initial data');
    const ontologies: Ontology[] = await getRelations(initialNode.id);

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
    const ontologies: Ontology[] = await getRelations(node.id);

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
  };

  const drawGraph = () => {
    if (!nodes || !links || nodes.length === 0 || links.length === 0) return;

    const svg = select(svgref.current);

    drawLinks(svg, links, '.link', 'none', '#a03', 1);
    drawNodes(svg, nodes, '.node', 10, '#22a', '#22e', loadMoreData);
    drawNodeLabels(svg, nodes, '.nodeLabel');
    // drawEdgeLabels(svg, links, '.edgeLabel');

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
  }, []);

  useEffect(() => {
    drawGraph();
  }, [nodes, links]);

  return (
    <div>
      <svg
        style={{
          margin: '0 auto',
          marginTop: '10vh',
          overflow: 'visible',
          height: 500,
          width: 500,
        }}
        ref={svgref}
      />
    </div>
  );
};

export default Graph;
