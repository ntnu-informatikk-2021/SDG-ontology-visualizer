import * as d3 from 'd3';
import { select } from 'd3';
import {
  createEdgeLabelText,
  getRotationAndPosition,
  makePredicateUnique,
  mapNodeToGraphNodeAtDefaultPosition,
  mapOntologyToGraphEdge,
  mapOntologyToNonClickedGraphNode,
  mergeParallelEdges,
  removeDuplicates,
} from '../common/d3';
import { MainSvgSelection, SubSvgSelection } from '../types/d3/svg';
import { D3Edge, CenterForce, ForceSimulation, LinkForce } from '../types/d3/simulation';
import { GraphEdge, GraphNode, Node, Ontology } from '../types/ontologyTypes';

const nodeClassName = '.node';
const edgeClassName = '.edge';
const nodeRadius = 20;
const fontSize = 18;
const maxEdgeFontSize = 10;
const edgeDistance = 200;
const edgeStrokeWidth = 2;
const minScale: number = 0.2;
const maxScale: number = 10;

const normalizeScale = (value: number, min: number, max: number) => (value - min) / (max - min);

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
          const newScale = event.transform.k;
          if (this.scale !== newScale) {
            this.scale = event.transform.k;
            this.dynamicScaleManager();
          }

          this.scale = event.transform.k;
          const translate = [event.transform.x, event.transform.y];
          this.nodeSvg.attr('transform', `translate(${translate}) scale(${this.scale})`);
          this.edgeSvg.attr('transform', `translate(${translate}) scale(${this.scale})`);
        })
        .scaleExtent([minScale, maxScale]) as any,
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
      .distance(edgeDistance);

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
      .filter(removeDuplicates)
      .filter(mergeParallelEdges);

    this.resetForceSimulation();

    this.drawGraph();
  };

  drawGraph = () => {
    this.drawEdges();
    this.drawNodes();
    this.dynamicScaleManager();

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

        g.append('line')
          .attr('fill', 'none')
          .attr('stroke', '#aaa')
          .attr('stroke-width', edgeStrokeWidth);

        g.append('text')
          .text((edge: any) => createEdgeLabelText(edge.sourceToTarget, false))
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'after-egde')
          .attr('pointer-events', 'none')
          .attr('fill', '#222');

        g.append('text')
          .text((edge: any) => createEdgeLabelText(edge.targetToSource, true))
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'before-edge')
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
        (edge: any) =>
          `translate(${(edge.source.x + edge.target.x) / 2},${
            (edge.source.y + edge.target.y) / 2
          })`,
      );

    g.selectChild(this.selectNodeOrEdge)
      .attr('x1', (edge: any) => edge.source.x - (edge.source.x + edge.target.x) / 2)
      .attr('y1', (edge: any) => edge.source.y - (edge.source.y + edge.target.y) / 2)
      .attr('x2', (edge: any) => edge.target.x - (edge.source.x + edge.target.x) / 2)
      .attr('y2', (edge: any) => edge.target.y - (edge.source.y + edge.target.y) / 2);

    g.selectChild(this.selectLabel1).each(function (edge) {
      const position = getRotationAndPosition(edge);
      const thisEdge = select(this);
      thisEdge.attr(
        'transform',
        `translate(${[position.x, position.y]}), rotate(${position.degree})`,
      );
      const text = createEdgeLabelText(edge.sourceToTarget, position.flip);
      if (thisEdge.text() !== text) {
        thisEdge.text(text);
      }
    });

    g.selectChild(this.selectLabel2).each(function (edge) {
      const position = getRotationAndPosition(edge);
      const thisEdge = select(this);
      thisEdge.attr(
        'transform',
        `translate(${[position.x, position.y]}), rotate(${position.degree})`,
      );
      const text = createEdgeLabelText(edge.targetToSource, !position.flip);
      if (thisEdge.text() !== text) {
        thisEdge.text(text);
      }
    });
  };

  updateNodePositions = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .attr('transform', (node) => `translate(${node.x!},${node.y!})`);
  };

  getEdgeLabelOpacity = () => {
    if (this.scale >= 1) return 1;
    if (this.scale > 0.9) return normalizeScale(this.scale, 0.9, 1);
    return 0;
  };

  getEdgeLabelFontSize = () => Math.min(fontSize / this.scale, maxEdgeFontSize);

  dynamicScaleManager = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectLabel1)
      .attr('font-size', fontSize / this.scale);

    const edges = this.edgeSvg.selectAll(edgeClassName).data(this.edges);

    const edgeSVGLine = edges.selectChild(this.selectNodeOrEdge);
    edgeSVGLine.attr('stroke-width', edgeStrokeWidth / this.scale);

    const edgeLabel1 = edges.selectChild(this.selectLabel1);
    const edgeLabel2 = edges.selectChild(this.selectLabel2);
    const edgeLabelFontSize = this.getEdgeLabelFontSize();
    const edgeLabelOpacity = this.getEdgeLabelOpacity();
    edgeLabel1.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
    edgeLabel2.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
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
          );
        // .attr('stroke', '#322659')
        // .attr('stroke-width', '2');
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
          );
        //  .attr('stroke', '#aaa')
        //   .attr('stroke-width', '1');
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
  selectLabel1 = (_: any, index: number) => index === 1;
  selectLabel2 = (_: any, index: number) => index === 2;
}
