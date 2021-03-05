import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  Selection,
  Simulation,
  SimulationNodeDatum,
} from 'd3';
import { GraphEdge, GraphNode } from '../types/ontologyTypes';

export const createForceSimulation = (
  nodes: GraphNode[],
  links: GraphEdge[],
): Simulation<GraphNode, undefined> =>
  forceSimulation(nodes)
    .force('charge', forceManyBody())
    .force('center', forceCenter(500 / 2, 500 / 2))
    .force(
      'link',
      forceLink()
        .id((node: SimulationNodeDatum) => (node as GraphNode).id)
        .links(links)
        .distance(100)
        .strength(2),
    );

export const drawLinks = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  links: GraphEdge[],
  linkClassName: string,
  fillColor: string,
  strokeColor: string,
  strokeWidth: number,
) => {
  svg
    .selectAll(linkClassName)
    .data(links)
    .join('line')
    .attr('class', linkClassName.substring(1)) // remove . before class name
    .attr('fill', fillColor)
    .attr('stroke', strokeColor)
    .attr('stroke-width', strokeWidth);
};

export const updateLinkPositions = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  links: GraphEdge[],
  linkClassName: string,
) => {
  svg
    .selectAll(linkClassName)
    .data(links)
    .join('line')
    .attr('x1', (link: any) => link.source.x)
    .attr('y1', (link: any) => link.source.y)
    .attr('x2', (link: any) => link.target.x)
    .attr('y2', (link: any) => link.target.y);
};

export const drawNodes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  nodeClassName: string,
  radius: number,
  fillColor: string,
) => {
  svg
    .selectAll(nodeClassName)
    .data(nodes)
    .join('circle')
    .attr('class', nodeClassName.substring(1)) // remove . from class name
    .attr('r', radius)
    .attr('fill', fillColor);
};

export const updateNodePositions = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  nodeClassName: string,
) => {
  svg
    .selectAll(nodeClassName)
    .data(nodes)
    .join('circle')
    .attr('cx', (node) => node.x!)
    .attr('cy', (node) => node.y!);
};
