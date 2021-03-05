import React, { useRef, useEffect, useState } from 'react';
import { select } from 'd3';
import { GraphEdge, GraphNode, Node, Ontology } from '../types/ontologyTypes';
import { getRelations } from '../api/ontologies';
import {
  createForceSimulation,
  drawLinks,
  drawNodes,
  updateLinkPositions,
  updateNodePositions,
} from '../d3/d3';
import { mapOntologyToGraphEdge } from '../common/d3';

const initialNode: Node = {
  prefix: {
    prefix: 'wine',
    iri: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#',
  },
  name: 'FormanChardonnay',
  id: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#FormanChardonnay',
};

const Graph: React.FC = () => {
  const svgref = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [links, setLinks] = useState<GraphEdge[]>([]);

  const loadInitialData = async () => {
    const ontologies: Ontology[] = await getRelations(initialNode.id);

    const newNodes: GraphNode[] = ontologies.map((ontology) => ontology.Object);
    newNodes.push(initialNode as GraphNode);
    const newLinks = ontologies.map(mapOntologyToGraphEdge);

    setNodes(newNodes);
    setLinks(newLinks);
  };

  const drawGraph = () => {
    if (!nodes || !links || nodes.length === 0 || links.length === 0) return;

    const svg = select(svgref.current);

    drawLinks(svg, links, '.link', 'none', 'red', 4);
    drawNodes(svg, nodes, '.node', 20, 'blue');

    createForceSimulation(nodes, links).on('tick', () => {
      updateLinkPositions(svg, links, '.link');
      updateNodePositions(svg, nodes, '.node');
    });
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
        style={{ margin: '0 auto', marginTop: '10vh', overflow: 'visible', height: 500 }}
        ref={svgref}
      />
    </div>
  );
};

export default Graph;
