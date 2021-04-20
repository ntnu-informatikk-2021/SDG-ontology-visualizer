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
  GraphEdgeFilter,
  LinkForce,
} from '../types/d3/simulation';
import { MainSvgSelection, SubSvgSelection } from '../types/d3/svg';
import { GraphEdge, GraphNode, Ontology } from '../types/ontologyTypes';
import FpsCounter from '../utils/FpsCounter';
import { nextFrame, normalizeScale } from '../common/other';
import setBrowserPosition from '../common/setBrowserPosition';

const nodeClassName = '.node';
const nodeRadius = 25;
const nodeHighlightRadiusMultiplier = 1.2;
const nodeLabelColor = '#2D3748';
const nodeStrokeWidth = 0;

const nodeMenuBtnRadius = 15;

const edgeClassName = '.edge';
const maxEdgeFontSize = 10;
const edgeDistance = 200;
const edgeWidth = 2;
const edgeColor = '#A0AEC0';
const edgeLabelColor = '#222';
const edgeHighlightColor = '#00A3C4';

const fontSize = 16;
const minScale = 0.4;
const maxScale = 5;

export default class {
  private readonly forceSimulation: ForceSimulation;
  private readonly svg: MainSvgSelection;
  private readonly nodeSvg: SubSvgSelection;
  private readonly edgeSvg: SubSvgSelection;
  private onExpandNode: (node: GraphNode) => void;
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
  private edgeFilter: GraphEdgeFilter;
  private nodeMenu?: d3.Selection<SVGGElement, GraphNode, null, undefined>;
  private edgeLabelsVisible = true;

  constructor(
    svg: SVGSVGElement,
    width: number,
    height: number,
    initialNode: GraphNode,
    onClickNode: (node: GraphNode) => void,
    nodeFilter: GraphNodeFilter,
    edgeFilter: GraphEdgeFilter,
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
    this.onExpandNode = onClickNode;
    this.nodeFilter = nodeFilter;
    this.edgeFilter = edgeFilter;
    this.initZoom();
    this.forceSimulation = this.initForceSimulation();
    this.fpsCounter = new FpsCounter();
  }

  updateOnClickCallback = (callback: (node: GraphNode) => void) => {
    this.onExpandNode = callback;
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
    this.nodes = this.nodes.filter((node) =>
      this.edges.some((edge) => {
        const source = typeof edge.source === 'string' ? edge.source : edge.source.id;
        const target = typeof edge.target === 'string' ? edge.target : edge.target.id;
        return node.id === source || node.id === target;
      }),
    );
  };

  removeDisconnectedEdges = () => {
    this.edges = this.edges.filter((edge) => {
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
    this.edges = this.unfilteredEdges.filter(this.edgeFilter);
    this.removeDisconnectedNodes();
    this.removeDisconnectedEdges();
    this.resetForceSimulation();
    this.drawGraph();
  };

  setNodeFilter = (filter: GraphNodeFilter) => {
    this.nodeFilter = filter;
    this.redrawGraphWithFilter();
  };
  setEdgeFilter = (filter: GraphEdgeFilter) => {
    this.edgeFilter = filter;
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
            this.scaleGraph();
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
      .alphaDecay(0.05)
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
    this.scaleGraph();

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
          .text((edge) => createEdgeLabelText(edge.sourceToTarget, false))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'text-after-edge')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);

        g.append('text')
          .text((edge) => createEdgeLabelText(edge.targetToSource, true))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'text-before-edge')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);

        return g;
      })
      .attr('class', edgeClassName.substring(1)); // remove . before class name
  };

  makeNodeMenuButton = (
    menu: d3.Selection<SVGGElement, GraphNode, any, any>,
    x: number,
    onClick: (event: any) => void,
    icon: string,
  ): void => {
    const button = menu.append('g').attr('transform', `translate(${x}, 0)`);
    button
      .append('circle')
      .on('click', onClick)
      .on('mouseover', function highlightMenu() {
        d3.select(this).style('cursor', 'pointer').style('stroke', edgeHighlightColor);
      })
      .on('mouseout', function resetHighlightMenu() {
        d3.select(this).style('stroke', edgeColor);
      })
      .transition('200')
      .attr('r', nodeMenuBtnRadius)
      .attr('fill', '#eee')
      .attr('stroke', edgeColor)
      .style('stroke-width', 2);

    button
      .append('image')
      .transition('200')
      .attr('width', nodeMenuBtnRadius * 2)
      .attr('height', nodeMenuBtnRadius * 2)
      .attr('transform', `translate(${-nodeMenuBtnRadius},${-nodeMenuBtnRadius})`)
      .attr('xlink:href', icon)
      .attr('pointer-events', 'none');
  };

  showMenuAtNode = async (
    node: GraphNode,
    g: d3.Selection<SVGGElement, GraphNode, null, undefined>,
  ) => {
    await nextFrame();
    this.removeNodeMenu();
    const menuPos = this.getNodeMenuPosition();
    const menuG = g
      .append('g')
      .attr('class', 'menu')
      .attr('transform', `translate(${[menuPos.x, menuPos.y]}) scale(${menuPos.scale})`);

    // expand button
    setTimeout(
      () =>
        this.makeNodeMenuButton(
          menuG,
          nodeMenuBtnRadius * 3.75,
          () => {
            this.onExpandNode(node);
          },
          'icons/addNodesIcon.svg',
        ),
      150,
    );

    // remove
    setTimeout(
      () =>
        this.makeNodeMenuButton(
          menuG,
          nodeMenuBtnRadius * 1.25,
          () => this.removeNode(node),
          'icons/removeNodeIcon.svg',
        ),
      100,
    );

    // unlock
    setTimeout(
      () =>
        this.makeNodeMenuButton(
          menuG,
          -nodeMenuBtnRadius * 1.25,
          (event) => {
            const nodeContainer = event.target.parentNode.parentNode.parentNode;
            if (node.isLocked) this.unlockNode(nodeContainer, node);
            else this.lockNode(nodeContainer, node, node.x!, node.y!, true);
          },
          `icons/${node.isLocked ? 'unlockNode' : 'lockNode'}.svg`,
        ),
      50,
    );

    // detail
    this.makeNodeMenuButton(
      menuG,
      -nodeMenuBtnRadius * 3.75,
      () => {
        this.onExpandNode(node);
        setBrowserPosition();
      },
      'icons/goToDetailView.svg',
    );
    this.nodeMenu = menuG;
  };

  setEdgeLabelsVisible = () => {
    this.edgeLabelsVisible = !this.edgeLabelsVisible;
    this.scaleGraph();
  };

  unlockAllNodes = () => {
    this.localUnlockAllNodes(this.unlockNode);
  };

  localUnlockAllNodes = (unlockNode: (nodeContainer: SVGGElement, node: GraphNode) => void) => {
    this.removeNodeMenu();
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .each(function (node) {
        const nodeContainer = d3.select(this).node() as SVGGElement;
        unlockNode(nodeContainer, node);
      });
  };

  unlockNode = (nodeContainer: SVGGElement, node: GraphNode): void => {
    const n = node;
    n.fx = undefined;
    n.fy = undefined;
    n.isLocked = false;
    this.forceSimulation.alpha(0.5);
    this.forceSimulation.restart();
    d3.select(nodeContainer).selectChild(this.selectNodeLockIcon).style('opacity', 0);
  };

  lockNode = (
    nodeContainer: SVGGElement,
    node: GraphNode,
    x: number,
    y: number,
    updateOpcity: boolean,
  ) => {
    const n = node;
    n.fx = x;
    n.fy = y;
    n.isLocked = true;
    if (updateOpcity) {
      d3.select(nodeContainer).selectChild(this.selectNodeLockIcon).style('opacity', 0.7);
    }
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
          .attr('fill', (node) => changeColorBasedOnType(node.type))
          .attr('stroke', '#aaa')
          .on('click', (event: PointerEvent, node) => {
            if (!event.target) return;
            const menu = (event.target as SVGElement).parentNode as SVGGElement;
            this.showMenuAtNode(node, d3.select(menu));
          });

        g.append('image')
          .attr('width', nodeRadius * 0.8)
          .attr('height', nodeRadius * 0.8)
          .attr('transform', `translate(${-nodeRadius / 2.4},${nodeRadius / 4.0})`)
          .attr('xlink:href', 'icons/lockNode.svg')
          .attr('pointer-events', 'none')
          .style('opacity', (node) => (node.isLocked ? 0.7 : 0))
          .attr('fill', '#f00');

        g.append('text')
          .text((node) => node.name)
          .attr('text-anchor', 'middle')
          .attr('pointer-events', 'none')
          .attr('fill', nodeLabelColor)
          .attr('dominant-baseline', 'middle')
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
                .attr('dominant-baseline', 'text-after-edge')
                .append('tspan')
                .text(secondLine)
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'mathematical');
            }
          });

        return g;
      })
      .attr('class', nodeClassName.substring(1)); // remove . from class name

    this.registerMouseoverNodeEvent(this.edgeSvg, this.edges);
    this.registerMouseoutNodeEvent(this.edgeSvg, this.edges);
    this.registerDragNodeEvent();
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

    g.selectChild(this.selectEdgeLabel1).each(function (edge) {
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

    g.selectChild(this.selectEdgeLabel2).each(function (edge) {
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
    if (this.edgeLabelsVisible) {
      if (this.scale >= 1) return 1;
      if (this.scale > 0.9) return normalizeScale(this.scale, 0.9, 1);
    }
    return 0;
  };

  getNodeMenuPosition = () => {
    const yPos = -nodeRadius * nodeHighlightRadiusMultiplier - 15 / this.scale;
    return { x: 0, y: yPos, scale: 1 / this.scale };
  };

  getEdgeLabelFontSize = () => Math.min(fontSize / this.scale, maxEdgeFontSize);

  getNodeLabelFontSize = () => (this.scale <= 0.6 ? fontSize / 0.6 : fontSize / this.scale);

  scaleGraph = () => {
    const nodes = this.nodeSvg.selectAll(nodeClassName).data(this.nodes);
    nodes.selectChild(this.selectNodeLabel).attr('font-size', this.getNodeLabelFontSize());
    nodes.selectChild(this.selectNodeOrEdge).attr('stroke-width', nodeStrokeWidth / this.scale);

    if (this.nodeMenu) {
      const position = this.getNodeMenuPosition();
      this.nodeMenu.attr(
        'transform',
        `translate(${[position.x, position.y]}) scale(${position.scale})`,
      );
    }
    const edges = this.edgeSvg.selectAll(edgeClassName).data(this.edges);
    const edgeSVGLine = edges.selectChild(this.selectNodeOrEdge);
    edgeSVGLine.attr('stroke-width', edgeWidth / this.scale);

    const edgeLabel1 = edges.selectChild(this.selectEdgeLabel1);
    const edgeLabel2 = edges.selectChild(this.selectEdgeLabel2);
    const edgeLabelFontSize = this.getEdgeLabelFontSize();
    const edgeLabelOpacity = this.getEdgeLabelOpacity();
    edgeLabel1.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
    edgeLabel2.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
  };

  registerMouseoverNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectNodeOrEdge)
      .on('mouseover', (event: MouseEvent, node) => {
        if (!event.target) return;
        d3.select(event.target as SVGCircleElement)
          .transition('500')
          .attr('r', nodeRadius * nodeHighlightRadiusMultiplier)
          .attr('stroke-width', 3 / this.scale)
          .attr('stroke', edgeHighlightColor);

        const graphEdges = edgeSvg
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
        graphEdges
          .selectChild(this.selectNodeOrEdge)
          .transition('500')
          .attr('stroke-width', (edgeWidth * 1.5) / this.scale)
          .attr('stroke', edgeHighlightColor);
        graphEdges
          .filter((edge) =>
            typeof edge.source === 'object' ? edge.source.id === node.id : edge.source === node.id,
          )
          .selectChild(this.selectEdgeLabel1)
          .attr('font-weight', 'bold');
        graphEdges
          .filter((edge) =>
            typeof edge.target === 'object' ? edge.target.id === node.id : edge.target === node.id,
          )
          .selectChild(this.selectEdgeLabel2)
          .attr('font-weight', 'bold');
      });
  };

  registerMouseoutNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectNodeOrEdge)
      .on('mouseout', (event: MouseEvent, node) => {
        if (!event.target) return;
        d3.select(event.target as SVGCircleElement)
          .transition('500')
          .attr('r', nodeRadius)
          .attr('stroke-width', 0);

        const graphEdges = edgeSvg
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
        graphEdges
          .selectChild(this.selectNodeOrEdge)
          .transition('500')
          .attr('stroke-width', edgeWidth / this.scale)
          .attr('stroke', edgeColor);
        graphEdges
          .filter((edge) =>
            typeof edge.source === 'object' ? edge.source.id === node.id : edge.source === node.id,
          )
          .selectChild(this.selectEdgeLabel1)
          .attr('font-weight', 'normal');
        graphEdges
          .filter((edge) =>
            typeof edge.target === 'object' ? edge.target.id === node.id : edge.target === node.id,
          )
          .selectChild(this.selectEdgeLabel2)
          .attr('font-weight', 'normal');
      });
  };

  registerDragNodeEvent = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)

      .call(
        d3
          .drag()
          .on('drag', (event, value) => {
            const node = value as GraphNode;
            this.lockNode(
              event.sourceEvent.target.parentNode,
              node,
              event.x,
              event.y,
              !node.isLocked!,
            );
            this.forceSimulation.alpha(0.5);
            this.forceSimulation.restart();
          })
          // eslint-disable-next-line func-names
          /*
          .on('start', (event) => {
            d3.select(event.sourceEvent.target);
          })
          */
          .on('end', (event, d) => {
            if (!event.sourceEvent.target) return;
            const menu = (event.sourceEvent.target as SVGElement).parentNode as SVGGElement;
            this.showMenuAtNode(d as GraphNode, d3.select(menu));
          }) as any,
      );
  };

  selectNodeOrEdge = (_: any, index: number) => index === 0;

  selectEdgeLabel1 = (_: any, index: number) => index === 1;
  selectEdgeLabel2 = (_: any, index: number) => index === 2;

  selectNodeLockIcon = (_: any, index: number) => index === 1;
  selectNodeLabel = (_: any, index: number) => index === 2;

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
