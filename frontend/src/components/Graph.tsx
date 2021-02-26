import React, { useRef, useEffect } from 'react';
import { forceCenter, forceManyBody, forceSimulation, select } from 'd3';
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
  // const data = [
  //   { id: 1, x: 100, y: 100 },
  //   { id: 2, x: 200, y: 150 },
  // ];
  // const links = [{ source: data[0], target: data[1] }];

  const loadInitialData = async () => {
    const svg = select(svgref.current);
    const relations: Ontology[] = await getRelations(initialNode.id);
    const svgData: GraphNode[] = relations.map((ontology) => ontology.Object!);
    console.log(relations);

    const simulation = forceSimulation(svgData)
      .force('charge', forceManyBody())
      .force('center', forceCenter(500 / 2, 500 / 2))
      .on('tick', () => {
        console.log(simulation.alpha());

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
    // svg
    //   .selectAll('.link')
    //   .data(links)
    //   .join('line')
    //   .attr('class', 'link')
    //   .attr('fill', 'none')
    //   .attr('stroke', 'red')
    //   .attr('stroke-width', 4)
    //   .attr('x1', (link: any) => link.source.x)
    //   .attr('y1', (link: any) => link.source.y)
    //   .attr('x2', (link: any) => link.target.x)
    //   .attr('y2', (link: any) => link.target.y);
    // simulation();
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
