import * as d3 from 'd3';
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
import nextFrame from '../common/other';

const nodeClassName = '.node';
// const nodeColor = '#4299e1';
const nodeLockedColor = '#27c';
const nodeRadius = 20;
const nodeHighlightColor = '#69f';
const nodeHighlightRadiusMultiplier = 1.5;
const nodeLabelColor = '#000';
const nodeStrokeWidth = 0;

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
  private nodeMenu?: d3.Selection<SVGGElement, GraphNode, null, undefined>;

  constructor(
    svg: SVGSVGElement,
    width: number,
    height: number,
    initialNode: GraphNode,
    onClickNode: (node: GraphNode) => void,
    nodeFilter: GraphNodeFilter,
  ) {
    this.svg = d3.select(svg).on('click', this.removeNodeMenu);
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
          this.removeNodeMenu();
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

  showMenuAtNode = async (
    node: GraphNode,
    g: d3.Selection<SVGGElement, GraphNode, null, undefined>,
  ) => {
    await nextFrame();
    this.removeNodeMenu();
    const menuG = g
      .append('g')
      .attr('class', 'menu')
      .attr('transform', `translate(0,${-nodeRadius * 2})`);

    const expandBtn = menuG.append('g').attr('transform', `translate(${nodeRadius}, 0)`);
    expandBtn
      .append('circle')
      .attr('r', nodeRadius / 2)
      .attr('fill', '#eee')
      .attr('stroke', edgeColor)
      .on('click', () => {
        this.onClickNode(node);
      });
    expandBtn
      .append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', `translate(${-20 / 2},${-20 / 2})`)
      .attr('xlink:href', 'icons/addNodesIcon.svg')
      .attr('pointer-events', 'none');

    const removeNodeBtn = menuG.append('g');
    removeNodeBtn
      .append('circle')
      .attr('r', nodeRadius / 2)
      .attr('fill', '#eee')
      .attr('stroke', edgeColor)
      .on('click', () => {
        this.removeNode(node);
      });
    removeNodeBtn
      .append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', `translate(${-20 / 2},${-20 / 2})`)
      .attr('xlink:href', 'icons/removeNodeIcon.svg')
      .attr('pointer-events', 'none');

    const unlockBtn = menuG.append('g').attr('transform', `translate(${-nodeRadius}, 0)`);
    unlockBtn
      .append('circle')
      .attr('r', nodeRadius / 2)
      .attr('fill', '#eee')
      .attr('stroke', edgeColor)
      .on('click', (_, d) => {
        const n = d;
        n.fx = undefined;
        n.fy = undefined;
        n.isLocked = false;
      });
    unlockBtn
      .append('image')
      .attr('width', 20)
      .attr('height', 20)
      .attr('transform', `translate(${-20 / 2},${-20 / 2})`)
      .attr('xlink:href', 'icons/unlockNode.svg')
      .attr('pointer-events', 'none');
    this.nodeMenu = menuG;
  };

  removeNodeMenu = () => {
    if (this.nodeMenu) {
      this.nodeMenu.remove();
      this.nodeMenu = undefined;
    }
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
          .attr('stroke', '#aaa')
          .on('click', (event: PointerEvent, node) => {
            if (!event.target) return;
            const menu = (event.target as SVGElement).parentNode as SVGGElement;
            this.showMenuAtNode(node, d3.select(menu));
          });

        g.append('text')
          .text((node) => node.name)
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', nodeLabelColor)
          .attr('alignment-baseline', 'middle')
          .each(function () {
            const text = d3.select(this).text();
            const words = text.split(' ');

            if (text.length > 20 && words.length > 2) {
              const firstLine = words.reduce((acc, curr) =>
                acc.length + curr.length > 20 ? acc : `${acc} ${curr}`,
              );
              const secondLine = text.replace(firstLine, '');
              if (!secondLine) return;
              d3.select(this)
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

    g.selectChild(this.selectLabel1).each(function (edge) {
      const position = getRotationAndPosition(edge);
      const thisEdge = d3.select(this);
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
      const thisEdge = d3.select(this);
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
    const nodes = this.nodeSvg.selectAll(nodeClassName).data(this.nodes);
    nodes.selectChild(this.selectLabel1).attr('font-size', fontSize / this.scale);
    nodes.selectChild(this.selectNodeOrEdge).attr('stroke-width', nodeStrokeWidth / this.scale);

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
          // eslint-disable-next-line func-names
          .on('drag', (event, value) => {
            this.removeNodeMenu();
            const node = value as GraphNode;
            node.fx = event.x;
            node.fy = event.y;
            node.isLocked = true;
          })
          // eslint-disable-next-line func-names
          .on('start', (event) => {
            if (!event.active) {
              simulation.alpha(simulation.alpha() + 0.3);
              simulation.restart();
            }
            d3.select(event.sourceEvent.target).attr('fill', nodeHighlightColor);
          })
          .on('end', (event, d) => {
            if (!event.sourceEvent.target) return;
            const menu = (event.sourceEvent.target as SVGElement).parentNode as SVGGElement;
            this.showMenuAtNode(d as GraphNode, d3.select(menu));
          }) as any,
      );
  };

  selectNodeOrEdge = (_: any, index: number) => index === 0;
  selectLabel1 = (_: any, index: number) => index === 1;
  selectLabel2 = (_: any, index: number) => index === 2;
}
