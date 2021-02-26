import React, { useRef, useEffect } from 'react';
import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  SimulationNodeDatum,
} from 'd3';
import { GraphNode, Node, Ontology } from '../types';
import { getRelations } from '../api/ontologies';

const initialNode: Node = {
  prefix: {
    prefix: 'wine',
    iri: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#',
  },
  name: 'FormanChardonnay',
  id: 'http://www.w3.org/TR/2003/PR-owl-guide-20031209/wine#FormanChardonnay',
};

const Graph: React.FC = () => {
  const svgref = useRef(null);

  const loadInitialData = async () => {
    const svg = select(svgref.current);
    let relations: Ontology[] = await getRelations(initialNode.id);
    relations = relations.map((ont) => ({
      Subject: ont.Subject || initialNode,
      Object: ont.Object || initialNode,
      Predicate: ont.Predicate,
    }));
    const svgData: GraphNode[] = relations.map((ontology) => ontology.Object!);
    svgData.push(initialNode as GraphNode);
    console.log(svgData);
    console.log(relations);

    const links = relations.map((ont) => ({ source: ont.Subject!.id, target: ont.Object!.id }));
    console.log(links);

    forceSimulation(svgData)
      .force('charge', forceManyBody())
      .force('center', forceCenter(500 / 2, 500 / 2))
      .force(
        'link',
        forceLink()
          .id((node: SimulationNodeDatum) => (node as GraphNode).id)
          .links(links)
          .distance(100)
          .strength(2),
      )
      .on('tick', () => {
        svg
          .selectAll('.link')
          .data(links)
          .join('line')
          .attr('class', 'link')
          .attr('fill', 'none')
          .attr('stroke', 'red')
          .attr('stroke-width', 4)
          .attr('x1', (link: any) => link.source.x)
          .attr('y1', (link: any) => link.source.y)
          .attr('x2', (link: any) => link.target.x)
          .attr('y2', (link: any) => link.target.y);

        svg
          .selectAll('.node')
          .data(svgData)
          .join('circle')
          .attr('class', 'node')
          .attr('r', 20)
          .attr('fill', 'blue')
          .attr('cx', (node) => node.x!)
          .attr('cy', (node) => node.y!);
      });
  };

  useEffect(() => {
    loadInitialData();
  }, []);

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
