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
const nodeRadius = 10;
const fontSize = 18;
const linkDistance = 100;

export default class {
  private readonly forceSimulation: ForceSimulation;
  private readonly svg: MainSvgSelection;
  private readonly nodeSvg: SubSvgSelection;
  private readonly edgeSvg: SubSvgSelection;
  private readonly onClickNode: (node: GraphNode) => void;
  private width: number;
  private height: number;
  private nodes: Array<GraphNode>;
  private edges: Array<D3Edge | GraphEdge>;
  private scale: number = 1;

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
          this.scale = event.transform.k;
          const translate = [event.transform.x, event.transform.y];
          this.nodeSvg.attr('transform', `translate(${translate}) scale(${this.scale})`);
          this.edgeSvg.attr('transform', `translate(${translate}) scale(${this.scale})`);
          this.makeTextSizeConstant();
        })
        .scaleExtent([0.2, 20]) as any,
    );
  };

  chargeForce = () => d3.forceManyBody().strength(-100);

  centerForce = () => d3.forceCenter(this.width / 2, this.height / 2);

  collisionForce = () => d3.forceCollide().radius(nodeRadius * 2);

  linkForce = () =>
    d3
      .forceLink()
      .id((node) => (node as GraphNode).id)
      .links(this.edges)
      .distance(linkDistance);

  initForceSimulation = () =>
    d3
      .forceSimulation(this.nodes)
      .force('charge', this.chargeForce())
      .force('center', this.centerForce())
      .force('collide', this.collisionForce())
      .force('link', this.linkForce())
      .alphaDecay(0.015)
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
    this.forceSimulation.restart();
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
    this.drawEdges();
    this.drawNodes();

    this.forceSimulation.on('tick', () => {
      this.updateEdgePositions();
      this.updateNodePositions();
    });
  };

  drawEdges = () => {
    this.edgeSvg
      .selectAll(edgeClassName)
      .data(this.edges)
      .join((enter) => {
        const g = enter.append('g');

        g.append('line').attr('fill', 'none').attr('stroke', '#aaa').attr('stroke-width', 1);

        g.append('text')
          .text((node) => node.name)
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', '#222');

        return g;
      })
      .attr('class', edgeClassName.substring(1)); // remove . before class name
  };

  drawNodes = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .join((enter) => {
        const g = enter.append('g');

        g.append('circle')
          .attr('r', nodeRadius)
          .attr('fill', (node) => (node.isLocked ? '#7f0dd1' : '#4299e1'))
          .on('click', (_, node) => this.onClickNode(node));

        g.append('text')
          .text((node) => node.name)
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', '#000');

        return g;
      })
      .attr('class', nodeClassName.substring(1)); // remove . from class name

    this.registerMouseoverNodeEvent(this.edgeSvg, this.edges);
    this.registerMouseoutNodeEvent(this.edgeSvg, this.edges);
    this.registerDragNodeEvent(this.forceSimulation);
  };

  updateEdgePositions = () => {
    const g = this.edgeSvg
      .selectAll(edgeClassName)
      .data(this.edges)
      .attr(
        'transform',
        (link: any) =>
          `translate(${(link.source.x + link.target.x) / 2},${
            (link.source.y + link.target.y) / 2
          })`,
      );

    g.selectChild(this.selectNodeOrEdge)
      .attr('x1', (link: any) => link.source.x - (link.source.x + link.target.x) / 2)
      .attr('y1', (link: any) => link.source.y - (link.source.y + link.target.y) / 2)
      .attr('x2', (link: any) => link.target.x - (link.source.x + link.target.x) / 2)
      .attr('y2', (link: any) => link.target.y - (link.source.y + link.target.y) / 2);
  };

  updateNodePositions = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .attr('transform', (node) => `translate(${node.x!},${node.y!})`);
  };

  makeTextSizeConstant = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectLabel)
      .attr('font-size', fontSize / this.scale);
    this.edgeSvg
      .selectAll(edgeClassName)
      .data(this.edges)
      .selectChild(this.selectLabel)
      .attr('font-size', fontSize / this.scale);
  };

  registerMouseoverNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      // eslint-disable-next-line func-names
      .on('mouseover', function (event, node) {
        const thisNode = d3.select(this).selectChild();
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
        const thisNode = d3.select(this).selectChild();
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
            if (!event.active) {
              simulation.alpha(simulation.alpha() + 0.3);
              simulation.restart();
            }
            d3.select(this).attr('fill', '#7f0dd1');
          }) as any,
        // .on('end', (_, d) => {
        // const node = d as GraphNode;
        // node.isLocked = false;
        // }) as any,
      );
  };

  selectNodeOrEdge = (_: any, index: number) => index === 0;

  selectLabel = (_: any, index: number) => index === 1;
}
