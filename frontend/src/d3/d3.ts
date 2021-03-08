import {
  forceCenter,
  forceCollide,
  forceLink,
  ForceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  select,
  Selection,
  Simulation,
  SimulationNodeDatum,
} from 'd3';
import { GraphEdge, GraphNode } from '../types/ontologyTypes';

export const createForceSimulation = (
  nodes: GraphNode[],
  links: GraphEdge[],
): Simulation<GraphNode, GraphEdge> =>
  forceSimulation(nodes)
    .force('charge', forceManyBody().strength(-999))
    .force('center', forceCenter(500 / 2, 500 / 2))
    .force('collide', forceCollide().radius(5)) // set radius dynamically
    .force(
      'x',
      forceX((node) => node.x!),
    )
    .force(
      'y',
      forceY((node) => node.y!),
    )
    .force(
      'link',
      forceLink()
        .id((node: SimulationNodeDatum) => (node as GraphNode).id)
        .links(links)
        .distance((link) => {
          const foo = Math.min(links.filter((l) => l.source === link.target).length * 10 + 30, 400);
          // console.log(foo);
          return foo;
        })
        .strength(1),
    )
    .alpha(1);

export const resetSimulation = (
  simulation: Simulation<GraphNode, GraphEdge>,
  nodes: GraphNode[],
  links: GraphEdge[],
) => {
  simulation.nodes(nodes);
  const foo = simulation.force<ForceLink<GraphNode, GraphEdge>>('link');
  if (!foo) return;
  foo.links(links);
  simulation.force('collide');
  simulation.alpha(1).restart();
};

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
  highlightColor: string,
  onClick: (node: GraphNode) => void,
) => {
  svg
    .selectAll(nodeClassName)
    .data(nodes)
    .join((enter) => enter.append('circle').attr('cx', 100).attr('cy', 100))
    .attr('class', nodeClassName.substring(1)) // remove . from class name
    .attr('r', radius)
    .attr('fill', fillColor)
    // eslint-disable-next-line func-names
    .on('mouseover', function () {
      select(this)
        .attr('fill', highlightColor)
        .transition('500')
        .attr('r', radius * 2);
    })
    // eslint-disable-next-line func-names
    .on('mouseout', function () {
      select(this).attr('fill', fillColor).transition('500').attr('r', radius);
    })
    .on('click', (_, node) => onClick(node));
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

export const drawNodeLabels = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(nodes)
    .join('text')
    .attr('class', labelClassName.substring(1)) // remove . from class name
    .text((node) => node.name.substring(0, 8)) // temporary to prevent clutter
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none')
    .attr('fill', '#aaa');
};

export const updateLabelPositions = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(nodes)
    .join('text')
    .attr('x', (node) => node.x!)
    .attr('y', (node) => node.y!);
};

export const drawEdgeLabels = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  links: GraphEdge[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(links)
    .join('text')
    .attr('class', labelClassName.substring(1)) // remove . from class name
    .text((node) => node.name)
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none')
    .attr('fill', '#222');
};

export const updateEdgeLabelPositions = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  links: GraphEdge[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(links)
    .join('text')
    .attr('x', (link: any) => (link.source.x + link.target.x) / 2)
    .attr('y', (link: any) => (link.source.y + link.target.y) / 2);
};
