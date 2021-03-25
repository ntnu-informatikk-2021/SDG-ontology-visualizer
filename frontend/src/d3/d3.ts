/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  drag,
  ForceCenter,
  forceCenter,
  forceCollide,
  forceLink,
  ForceLink,
  forceManyBody,
  forceSimulation,
  select,
  Selection,
  Simulation,
  SimulationNodeDatum,
} from 'd3';
import { D3Edge, GraphEdge, GraphNode } from '../types/ontologyTypes';

export const createForceSimulation = (
  nodes: GraphNode[],
  links: Array<D3Edge | GraphEdge>,
): Simulation<GraphNode, GraphEdge> =>
  forceSimulation(nodes)
    .force('banan', forceManyBody().strength(-100)) // strength between all nodes
    .force('center', forceCenter(500 / 2, 500 / 2)) // strength towards center of SVG
    .force('collide', forceCollide().radius(20)) // prevent collision
    .force(
      // force between two connected nodes
      'link',
      forceLink()
        .id((node: SimulationNodeDatum) => (node as GraphNode).id)
        .links(links)
        /*
          {
            id: string,
            source: object,
            target: object,
          }
          {
            id: string,
            source: string,
            target: string,
          }
        */
        .distance(100),

      // .distance((link) =>
      //   Math.min(links.filter((l) => l.source === link.target).length * 10 + 30, 400),
      // )
      // .strength(1),
    )
    .alphaTarget(0.03)
    .alphaDecay(0.01)
    .alpha(0.5)
    .velocityDecay(0.75);

export const resetSimulation = (
  simulation: Simulation<GraphNode, GraphEdge>,
  nodes: GraphNode[],
  links: Array<D3Edge | GraphEdge>,
) => {
  // console.log(nodes.map((node) => node.x));
  simulation.nodes(nodes);
  const centerForce = simulation.force<ForceCenter<GraphNode>>('center');
  if (centerForce) {
    centerForce.strength(0);
  }
  const linkForce = simulation.force<ForceLink<GraphNode, GraphEdge | D3Edge>>('link');
  if (linkForce) {
    linkForce.links(links);
  }
  simulation.alpha(simulation.alpha() + 0.5);
  // simulation.force('collide');
  // simulation.alpha(1).restart();
};

export const drawLinks = (
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  links: Array<D3Edge | GraphEdge>,
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
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  links: Array<D3Edge | GraphEdge>,
  linkClassName: string,
) => {
  svg
    .selectAll(linkClassName)
    .data(links)
    .attr('x1', (link: any) => link.source.x)
    .attr('y1', (link: any) => link.source.y)
    .attr('x2', (link: any) => link.target.x)
    .attr('y2', (link: any) => link.target.y);
};

export const drawNodes = (
  linkSvg: Selection<SVGGElement | null, unknown, null, undefined>,
  nodeSvg: Selection<SVGGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  nodeClassName: string,
  radius: number,
  fillColor: string,
  highlightColor: string,
  onClick: (node: GraphNode) => void,
  links: Array<GraphEdge | D3Edge>,
  simulation?: Simulation<GraphNode, GraphEdge>,
) => {
  nodeSvg
    .selectAll(nodeClassName)
    .data(nodes)
    .join((enter) => enter.append('circle').attr('cx', 100).attr('cy', 100))
    .attr('class', nodeClassName.substring(1)) // remove . from class name
    .attr('r', radius)
    .attr('fill', (node) => (node.isLocked ? '#7f0dd1' : fillColor))
    // eslint-disable-next-line func-names
    .on('mouseover', function (event, node) {
      const thisNode = select(this);
      if (!node.isLocked) {
        thisNode.attr('fill', highlightColor);
      }
      thisNode.transition('500').attr('r', radius * 2);
      linkSvg
        .selectAll('.link')
        .data(links)
        .filter(
          (link) =>
            (typeof link.source === 'object'
              ? link.source.id === node.id
              : link.source === node.id) ||
            (typeof link.target === 'object'
              ? link.target.id === node.id
              : link.target === node.id),
        )
        .attr('stroke', highlightColor)
        .attr('stroke-width', '2');
    })
    // eslint-disable-next-line func-names
    .on('mouseout', function (event, node) {
      const thisNode = select(this);
      if (!node.isLocked) {
        thisNode.attr('fill', fillColor);
      }
      thisNode.transition('500').attr('r', radius);
      linkSvg
        .selectAll('.link')
        .data(links)
        .filter(
          (link) =>
            (typeof link.source === 'object'
              ? link.source.id === node.id
              : link.source === node.id) ||
            (typeof link.target === 'object'
              ? link.target.id === node.id
              : link.target === node.id),
        )
        .attr('stroke', '#aaa')
        .attr('stroke-width', '1');
    })
    .on('click', (_, node) => onClick(node))
    .call(
      drag()
        // eslint-disable-next-line func-names
        .on('drag', (event, value) => {
          const node = value as GraphNode;
          node.fx = event.x;
          node.fy = event.y;
          node.isLocked = true;
        })
        // eslint-disable-next-line func-names
        .on('start', function (event, _) {
          if (!event.active && simulation) simulation.alpha(simulation.alpha() + 0.3);
          select(this).attr('fill', '#7f0dd1');
        })
        .on('end', (_, d) => {
          const node = d as GraphNode;
          // node.isLocked = false;
        }) as any,
    );
};

export const updateNodePositions = (
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  nodeClassName: string,
) => {
  svg
    .selectAll(nodeClassName)
    .data(nodes)
    .attr('cx', (node) => node.x!)
    .attr('cy', (node) => node.y!);
};

export const drawNodeLabels = (
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(nodes)
    .join('text')
    .attr('class', labelClassName.substring(1)) // remove . from class name
    // .text((node) => node.name.substring(0, 8)) // temporary to prevent clutter
    .text((node) => node.name)
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none')
    .attr('fill', '#000');
};

export const updateLabelPositions = (
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  nodes: GraphNode[],
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(nodes)
    .attr('x', (node) => node.x!)
    .attr('y', (node) => node.y!);
};

export const drawEdgeLabels = (
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
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
  svg: Selection<SVGGElement | null, unknown, null, undefined>,
  links: Array<D3Edge | GraphEdge>,
  labelClassName: string,
) => {
  svg
    .selectAll(labelClassName)
    .data(links)
    .attr('x', (link: any) => (link.source.x + link.target.x) / 2)
    .attr('y', (link: any) => (link.source.y + link.target.y) / 2);
};
function size(arg0: number): null {
  throw new Error('Function not implemented.');
}
