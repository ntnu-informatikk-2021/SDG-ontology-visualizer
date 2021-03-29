import * as d3 from 'd3';
import {
  makePredicateUnique,
  mapNodeToGraphNodeAtDefaultPosition,
  mapOntologyToGraphEdge,
  mapOntologyToNonClickedGraphNode,
  removeDuplicates,
} from '../common/d3';
import { MainSvgSelection, SubSvgSelection } from '../types/d3/svg';
import { D3Edge, CenterForce, ForceSimulation, LinkForce } from '../types/d3/simulation';
import { GraphEdge, GraphNode, Node, Ontology } from '../types/ontologyTypes';

const nodeClassName = '.node';
const edgeClassName = '.edge';
const nodeLabelClassName = '.node';
const edgeLabelClassName = '.edge';
const nodeRadius = 10;

export default class {
  private readonly forceSimulation: ForceSimulation;
  private readonly svg: MainSvgSelection;
  private readonly nodeSvg: SubSvgSelection;
  private readonly edgeSvg: SubSvgSelection;
  private readonly nodeLabelSvg: SubSvgSelection;
  private readonly edgeLabelSvg: SubSvgSelection;
  private readonly onClickNode: (node: GraphNode) => void;
  private width: number;
  private height: number;
  private nodes: Array<GraphNode>;
  private edges: Array<D3Edge | GraphEdge>;

  constructor(
    svg: SVGSVGElement,
    width: number,
    height: number,
    initialNode: Node,
    onClickNode: (node: GraphNode) => void,
  ) {
    this.svg = d3.select(svg);
    this.edgeSvg = this.svg.append('g');
    this.nodeSvg = this.svg.append('g');
    this.nodeLabelSvg = this.svg.append('g');
    this.edgeLabelSvg = this.svg.append('g');
    this.width = width;
    this.height = height;
    this.nodes = [initialNode as GraphNode];
    this.edges = [];
    this.onClickNode = onClickNode;
    this.initZoom();
    this.forceSimulation = this.initForceSimulation();
  }

  initZoom = () => {
    this.svg.call(
      d3
        .zoom()
        .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, any>) => {
          const scale = event.transform.k;
          const translate = [event.transform.x, event.transform.y];
          this.nodeSvg.attr('transform', `translate(${translate}) scale(${scale})`);
          this.edgeSvg.attr('transform', `translate(${translate}) scale(${scale})`);
          this.nodeLabelSvg.attr('transform', `translate(${translate}) scale(${scale})`);
          this.edgeLabelSvg.attr('transform', `translate(${translate}) scale(${scale})`);
        })
        .scaleExtent([0.2, 4]) as any,
    );
  };

  initForceSimulation = () =>
    d3
      .forceSimulation(this.nodes)
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collide', d3.forceCollide().radius(nodeRadius * 2))
      .force(
        'link',
        d3
          .forceLink()
          .id((node: d3.SimulationNodeDatum) => (node as GraphNode).id) // implicit types?
          .links(this.edges)
          .distance(100),
      )
      .alphaTarget(0.03)
      .alphaDecay(0.01)
      .alpha(0.5)
      .velocityDecay(0.75);

  resetForceSimulation = () => {
    this.forceSimulation.nodes(this.nodes);
    const centerForce = this.forceSimulation.force<CenterForce>('center');
    if (centerForce) {
      centerForce.strength(0);
    }
    const linkForce = this.forceSimulation.force<LinkForce>('link');
    if (linkForce) {
      linkForce.links(this.edges);
    }
    this.forceSimulation.alpha(this.forceSimulation.alpha() + 0.5);
  };

  addData = (ontologies: Array<Ontology>, clickedNode: GraphNode) => {
    if (ontologies.length === 0 || !clickedNode) return;

    this.nodes = this.nodes
      .concat(ontologies.map(mapOntologyToNonClickedGraphNode(clickedNode)))
      .filter(removeDuplicates)
      .map(mapNodeToGraphNodeAtDefaultPosition(clickedNode.x, clickedNode.y));

    this.edges = this.edges
      .concat(ontologies.map(makePredicateUnique).map(mapOntologyToGraphEdge))
      .filter(removeDuplicates);

    this.resetForceSimulation();

    this.drawGraph();
  };

  drawGraph = () => {
    this.drawLinks();
    this.drawNodes();
    this.drawNodeLabels();
    // this.drawEdgeLabels();

    this.forceSimulation.on('tick', () => {
      this.updateEdgePositions();
      this.updateNodePositions();
      this.updateNodeLabelPositions();
      // this.updateEdgeLabelPositions();
    });
  };

  drawLinks = () => {
    this.edgeSvg
      .selectAll(edgeClassName)
      .data(this.edges)
      .join('line')
      .attr('class', edgeClassName.substring(1)) // remove . before class name
      .attr('fill', 'none')
      .attr('stroke', '#aaa')
      .attr('stroke-width', 1);
  };

  drawNodes = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .join((enter) => enter.append('circle').attr('cx', 100).attr('cy', 100))
      .attr('class', nodeClassName.substring(1)) // remove . from class name
      .attr('r', nodeRadius)
      .attr('fill', (node) => (node.isLocked ? '#7f0dd1' : '#4299e1'))
      .on('click', (_, node) => this.onClickNode(node));
    this.registerMouseoverNodeEvent(this.edgeSvg, this.edges);
    this.registerMouseoutNodeEvent(this.edgeSvg, this.edges);
    this.registerDragNodeEvent(this.forceSimulation);
  };

  drawNodeLabels = () => {
    this.nodeLabelSvg
      .selectAll(nodeLabelClassName)
      .data(this.nodes)
      .join('text')
      .attr('class', nodeLabelClassName.substring(1)) // remove . from class name
      .text((node) => node.name)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', '#000');
  };

  drawEdgeLabels = () => {
    this.edgeLabelSvg
      .selectAll(edgeLabelClassName)
      .data(this.edges)
      .join('text')
      .attr('class', edgeLabelClassName.substring(1)) // remove . from class name
      .text((node) => node.name)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('fill', '#222');
  };

  updateEdgePositions = () => {
    this.edgeSvg
      .selectAll(edgeClassName)
      .data(this.edges)
      .attr('x1', (link: any) => link.source.x)
      .attr('y1', (link: any) => link.source.y)
      .attr('x2', (link: any) => link.target.x)
      .attr('y2', (link: any) => link.target.y);
  };

  updateNodePositions = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .attr('cx', (node) => node.x!)
      .attr('cy', (node) => node.y!);
  };

  updateEdgeLabelPositions = () => {
    this.edgeLabelSvg
      .selectAll(edgeLabelClassName)
      .data(this.edges)
      .attr('x', (link: any) => (link.source.x + link.target.x) / 2)
      .attr('y', (link: any) => (link.source.y + link.target.y) / 2);
  };

  updateNodeLabelPositions = () => {
    this.nodeLabelSvg
      .selectAll(nodeLabelClassName)
      .data(this.nodes)
      .attr('x', (node) => node.x!)
      .attr('y', (node) => node.y!);
  };

  registerMouseoverNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      // eslint-disable-next-line func-names
      .on('mouseover', function (event, node) {
        const thisNode = d3.select(this);
        if (!node.isLocked) {
          thisNode.attr('fill', '#322659');
        }
        thisNode.transition('500').attr('r', nodeRadius * 2);
        edgeSvg
          .selectAll(edgeClassName)
          .data(edges)
          .filter(
            (edge) =>
              (typeof edge.source === 'object'
                ? edge.source.id === node.id
                : edge.source === node.id) ||
              (typeof edge.target === 'object'
                ? edge.target.id === node.id
                : edge.target === node.id),
          )
          .attr('stroke', '#322659')
          .attr('stroke-width', '2');
      });
  };

  registerMouseoutNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      // eslint-disable-next-line func-names
      .on('mouseout', function (event, node) {
        const thisNode = d3.select(this);
        if (!node.isLocked) {
          thisNode.attr('fill', '#4299e1');
        }
        thisNode.transition('500').attr('r', nodeRadius);
        edgeSvg
          .selectAll(edgeClassName)
          .data(edges)
          .filter(
            (edge) =>
              (typeof edge.source === 'object'
                ? edge.source.id === node.id
                : edge.source === node.id) ||
              (typeof edge.target === 'object'
                ? edge.target.id === node.id
                : edge.target === node.id),
          )
          .attr('stroke', '#aaa')
          .attr('stroke-width', '1');
      });
  };

  registerDragNodeEvent = (simulation: ForceSimulation) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .call(
        d3
          .drag()
          // eslint-disable-next-line func-names
          .on('drag', (event, value) => {
            const node = value as GraphNode;
            node.fx = event.x;
            node.fy = event.y;
            node.isLocked = true;
          })
          // eslint-disable-next-line func-names
          .on('start', function (event) {
            if (!event.active) simulation.alpha(simulation.alpha() + 0.3);
            d3.select(this).attr('fill', '#7f0dd1');
          }) as any,
        // .on('end', (_, d) => {
        // const node = d as GraphNode;
        // node.isLocked = false;
        // }) as any,
      );
  };
}
