import * as d3 from 'd3';
import { select } from 'd3';
import {
  changeColorBasedOnType,
  createEdgeLabelText,
  getRotationAndPosition,
  makePredicateUnique,
  mapNodeToGraphNodeAtDefaultPosition,
  mapOntologyToGraphEdge,
  mapOntologyToNonClickedGraphNode,
  mergeParallelEdges,
  removeDuplicates,
  removingNodeWillMakeGraphEmpty,
} from '../common/d3';
import { setError } from '../state/reducers/apiErrorReducer';
import reduxStore from '../state/store';
import {
  CenterForce,
  D3Edge,
  ForceSimulation,
  GraphNodeFilter,
  LinkForce,
} from '../types/d3/simulation';
import { MainSvgSelection, SubSvgSelection } from '../types/d3/svg';
import { GraphEdge, GraphNode, Ontology } from '../types/ontologyTypes';
import FpsCounter from '../utils/FpsCounter';

const nodeClassName = '.node';
// const nodeColor = '#4299e1';
const nodeLockedColor = '#27c';
const nodeRadius = 20;
const nodeHighlightColor = '#69f';
const nodeHighlightRadiusMultiplier = 1.5;
const nodeLabelColor = '#000';

const edgeClassName = '.edge';
const maxEdgeFontSize = 10;
const edgeDistance = 200;
const edgeWidth = 2;
const edgeColor = '#aaa';
const edgeLabelColor = '#222';

const fontSize = 18;
const minScale = 0.2;
const maxScale = 10;

const normalizeScale = (value: number, min: number, max: number) => (value - min) / (max - min);

export default class {
  private readonly forceSimulation: ForceSimulation;
  private readonly svg: MainSvgSelection;
  private readonly nodeSvg: SubSvgSelection;
  private readonly edgeSvg: SubSvgSelection;
  private onClickNode: (node: GraphNode) => void;
  private width: number;
  private height: number;
  private nodes: Array<GraphNode>;
  private unfilteredNodes: Array<GraphNode>;
  private edges: Array<D3Edge | GraphEdge>;
  private unfilteredEdges: Array<D3Edge | GraphEdge>;
  private scale: number = 1;
  private nodeFilter: GraphNodeFilter;
  private frameIndex = 0;
  private readonly fpsCounter: FpsCounter;

  constructor(
    svg: SVGSVGElement,
    width: number,
    height: number,
    initialNode: GraphNode,
    onClickNode: (node: GraphNode) => void,
    nodeFilter: GraphNodeFilter,
  ) {
    this.svg = d3.select(svg);
    this.edgeSvg = this.svg.append('g');
    this.nodeSvg = this.svg.append('g');
    this.width = width;
    this.height = height;
    this.nodes = [initialNode];
    this.unfilteredNodes = [initialNode];
    this.edges = [];
    this.unfilteredEdges = [];
    this.onClickNode = onClickNode;
    this.nodeFilter = nodeFilter;
    this.initZoom();
    this.forceSimulation = this.initForceSimulation();
    this.fpsCounter = new FpsCounter();
  }

  updateOnClickCallback = (callback: (node: GraphNode) => void) => {
    this.onClickNode = callback;
  };

  removeNode = (node: GraphNode) => {
    if (removingNodeWillMakeGraphEmpty(node, this.edges)) {
      reduxStore.dispatch(setError(new Error('Oops, this would remove all nodes from the graph')));
      return;
    }
    this.unfilteredNodes = this.unfilteredNodes.filter((n) => n.id !== node.id);
    this.unfilteredEdges = this.unfilteredEdges.filter((edge) => {
      const source = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const target = typeof edge.target === 'string' ? edge.target : edge.target.id;
      return node.id !== source && node.id !== target;
    });
    this.removeDisconnectedNodes();
    this.redrawGraphWithFilter();
  };

  removeDisconnectedNodes = () => {
    this.unfilteredNodes = this.unfilteredNodes.filter((node) =>
      this.unfilteredEdges.some((edge) => {
        const source = typeof edge.source === 'string' ? edge.source : edge.source.id;
        const target = typeof edge.target === 'string' ? edge.target : edge.target.id;
        return node.id === source || node.id === target;
      }),
    );
  };

  removeDisconnectedEdges = () => {
    this.edges = this.unfilteredEdges.filter((edge) => {
      const source = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const target = typeof edge.target === 'string' ? edge.target : edge.target.id;
      return (
        this.nodes.some((node) => node.id === source) &&
        this.nodes.some((node) => node.id === target)
      );
    });
  };

  redrawGraphWithFilter = () => {
    this.nodes = this.unfilteredNodes.filter(this.nodeFilter);
    this.removeDisconnectedEdges();
    this.resetForceSimulation();
    this.drawGraph();
  };

  setNodeFilter = (filter: GraphNodeFilter) => {
    this.nodeFilter = filter;
    this.redrawGraphWithFilter();
  };

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
      .alphaDecay(0.1)
      .alpha(0.9)
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
    this.forceSimulation.alpha(0.9);
    this.forceSimulation.restart();
  };

  addData = (ontologies: Array<Ontology>, clickedNode: GraphNode) => {
    if (ontologies.length === 0 || !clickedNode) return;

    this.unfilteredNodes = this.unfilteredNodes
      .concat(ontologies.map(mapOntologyToNonClickedGraphNode(clickedNode)))
      .filter(removeDuplicates)
      .map(mapNodeToGraphNodeAtDefaultPosition(clickedNode.x, clickedNode.y));

    this.unfilteredEdges = this.unfilteredEdges
      .concat(ontologies.map(makePredicateUnique).map(mapOntologyToGraphEdge))
      .filter(removeDuplicates)
      .filter(mergeParallelEdges);

    this.redrawGraphWithFilter();
  };

  drawGraph = () => {
    this.drawEdges();
    this.drawNodes();
    this.dynamicScaleManager();

    this.forceSimulation.on('tick', () => {
      this.frameIndex += 1;
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
          .attr('stroke', edgeColor)
          .attr('stroke-width', edgeWidth);

        g.append('text')
          .text((edge: any) => createEdgeLabelText(edge.sourceToTarget, false))
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'after-egde')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);

        g.append('text')
          .text((edge: any) => createEdgeLabelText(edge.targetToSource, true))
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'before-edge')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);

        return g;
      })
      .attr('class', edgeClassName.substring(1)); // remove . before class name
  };

  drawNodes = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes, (node) => (node as GraphNode).id)
      .join((enter) => {
        const g = enter.append('g');

        g.append('circle')
          .attr('r', nodeRadius)
          .attr('fill', (node) =>
            node.isLocked ? nodeLockedColor : changeColorBasedOnType(node.type),
          )
          .on('click', (event: PointerEvent, node) => {
            if (event.ctrlKey) {
              this.removeNode(node);
            } else {
              this.onClickNode(node);
            }
          });

        g.append('text')
          .text((node) => node.name)
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', nodeLabelColor)
          .attr('alignment-baseline', 'middle')
          .each(function () {
            const text = select(this).text();
            const words = text.split(' ');

            if (text.length > 20 && words.length > 2) {
              const firstLine = words.reduce((acc, curr) =>
                acc.length + curr.length > 20 ? acc : `${acc} ${curr}`,
              );
              const secondLine = text.replace(firstLine, '');
              if (!secondLine) return;
              select(this)
                .text(firstLine)
                .attr('alignment-baseline', 'after-edge')
                .append('tspan')
                .text(secondLine)
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .attr('alignment-baseline', 'before-edge');
            }
          });

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

    if (this.fpsCounter.fps < 60 && !this.shouldRenderEdgeLabel()) return;

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
    edgeSVGLine.attr('stroke-width', edgeWidth / this.scale);

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
        d3.select(this)
          .selectChild()
          .attr('fill', nodeHighlightColor)
          .transition('500')
          .attr('r', nodeRadius * nodeHighlightRadiusMultiplier);

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
      });
  };

  registerMouseoutNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      // eslint-disable-next-line func-names
      .on('mouseout', function (event, node) {
        d3.select(this)
          .selectChild()
          .attr('fill', node.isLocked ? nodeLockedColor : changeColorBasedOnType(node.type))
          .transition('500')
          .attr('r', nodeRadius);
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
      });
  };

  registerDragNodeEvent = (simulation: ForceSimulation) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .call(
        d3
          .drag()
          .on('drag', (event, value) => {
            const node = value as GraphNode;
            node.fx = event.x;
            node.fy = event.y;
            node.isLocked = true;
            simulation.alpha(0.5);
            simulation.restart();
          })
          // eslint-disable-next-line func-names
          .on('start', function () {
            d3.select(this).attr('fill', nodeHighlightColor);
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

  shouldRenderEdgeLabel = (): boolean => {
    const { fps } = this.fpsCounter;
    let frameSkips = 1;
    if (fps < 15) frameSkips = 10;
    else if (fps < 20) frameSkips = 6;
    else if (fps < 30) frameSkips = 4;
    else if (fps < 40) frameSkips = 2;
    if (this.frameIndex < frameSkips) return false;
    this.frameIndex = 0;
    return true;
  };
}
