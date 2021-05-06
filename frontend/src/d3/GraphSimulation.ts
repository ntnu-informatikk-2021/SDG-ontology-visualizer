import * as d3 from 'd3';
import * as common from '../common/d3';
import { nextFrame, normalizeScale } from '../common/other';
import { setError } from '../state/reducers/apiErrorReducer';
import reduxStore from '../state/store';
import FpsCounter from '../utils/FpsCounter';
import { MainSvgSelection, SubSvgSelection } from '../types/d3/svg';
import { GraphEdge, GraphNode, Ontology } from '../types/ontologyTypes';
import {
  CenterForce,
  D3Edge,
  ForceSimulation,
  GraphEdgeFilter,
  GraphNodeFilter,
  LinkForce,
} from '../types/d3/simulation';

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
  private onSelectNode: (node: GraphNode) => void;
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
    onExpandNode: (node: GraphNode) => void,
    onSelectNode: (node: GraphNode) => void,
    nodeFilter: GraphNodeFilter,
    edgeFilter: GraphEdgeFilter,
  ) {
    this.svg = d3.select(svg).on('click', this.hideNodeMenu);
    this.edgeSvg = this.svg.append('g');
    this.nodeSvg = this.svg.append('g');
    this.width = width;
    this.height = height;
    this.nodes = [initialNode];
    this.unfilteredNodes = [initialNode];
    this.edges = [];
    this.unfilteredEdges = [];
    this.onExpandNode = onExpandNode;
    this.onSelectNode = onSelectNode;
    this.nodeFilter = nodeFilter;
    this.edgeFilter = edgeFilter;
    this.initZoom();
    this.forceSimulation = this.initForceSimulation();
    this.fpsCounter = new FpsCounter();
  }

  // ############################################
  // Force Simulation
  // ############################################

  // Repulsive forces between nodes. High strength to prevent cluttered nodes.
  chargeForce = () => d3.forceManyBody().strength(-100);

  // Force to make sure the initial graph spawns in the middle of the screen.
  centerForce = () => d3.forceCenter(this.width / 2, this.height / 2);

  // A hard collider to prevent overlapping nodes.
  collisionForce = () => d3.forceCollide().radius(nodeRadius * 2);

  // Repulsion force between connected nodes.
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

  // Called whenever nodes and/or edges are added or removed. Applies the new state to the force simulation
  resetForceSimulation = () => {
    this.forceSimulation.nodes(this.nodes);

    // Disable center force after graph has been initialized, to prevent drifting.
    const centerForce = this.forceSimulation.force<CenterForce>('center');
    if (centerForce) {
      centerForce.strength(0);
    }

    // update the link force with the new edges.
    const linkForce = this.forceSimulation.force<LinkForce>('link');
    if (linkForce) {
      linkForce.links(this.edges);
    }

    this.forceSimulation.alpha(0.9);
    this.forceSimulation.restart();
  };

  // ############################################
  // State Management
  // ############################################

  addData = (ontologies: Array<Ontology>, clickedNode: GraphNode) => {
    if (ontologies.length === 0 || !clickedNode) return;

    this.unfilteredNodes = this.unfilteredNodes
      .concat(ontologies.map(common.mapOntologyToNonClickedGraphNode(clickedNode)))
      .filter(common.removeDuplicates)
      .map(common.mapNodeToGraphNodeAtDefaultPosition(clickedNode.x, clickedNode.y));

    this.unfilteredEdges = this.unfilteredEdges
      .concat(ontologies.map(common.makePredicateUnique).map(common.mapOntologyToGraphEdge))
      .filter(common.removeDuplicates)
      .filter(common.mergeParallelEdges);

    this.redrawGraphWithFilter();
  };

  removeNode = (node: GraphNode) => {
    // throw an error if removing this node would make the graph empty
    if (common.removingNodeWillMakeGraphEmpty(node, this.edges)) {
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

  setNodeFilter = (filter: GraphNodeFilter) => {
    this.nodeFilter = filter;
    this.redrawGraphWithFilter();
  };

  setEdgeFilter = (filter: GraphEdgeFilter) => {
    this.edgeFilter = filter;
    this.redrawGraphWithFilter();
  };

  // ############################################
  // Rendering
  // ############################################

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
        // Label from node A to node B
        g.append('text')
          .text((edge) => common.createEdgeLabelText(edge.sourceToTarget, false))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'text-after-edge')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);
        // Label from node B to node A
        g.append('text')
          .text((edge) => common.createEdgeLabelText(edge.targetToSource, true))
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'text-before-edge')
          .attr('pointer-events', 'none')
          .attr('fill', edgeLabelColor);

        return g;
      })
      .attr('class', edgeClassName.substring(1)); // remove . before class name
  };

  showNodeMenu = async (
    node: GraphNode,
    g: d3.Selection<SVGGElement, GraphNode, null, undefined>,
  ) => {
    await nextFrame();
    if (!g) return;
    this.hideNodeMenu();
    const menuPos = this.getNodeMenuPosition();
    const menuG = g
      .append('g')
      .attr('class', 'menu')
      .attr('transform', `translate(${[menuPos.x, menuPos.y]}) scale(${menuPos.scale})`);

    // expand button
    setTimeout(
      () =>
        this.drawNodeMenuButton(
          menuG,
          nodeMenuBtnRadius * 3.75,
          () => {
            this.onExpandNode(node);
          },
          'icons/addNodesIcon.svg',
        ),
      150,
    );

    // remove button
    setTimeout(
      () =>
        this.drawNodeMenuButton(
          menuG,
          nodeMenuBtnRadius * 1.25,
          () => this.removeNode(node),
          'icons/removeNodeIcon.svg',
        ),
      100,
    );

    // unlock button
    setTimeout(
      () =>
        this.drawNodeMenuButton(
          menuG,
          -nodeMenuBtnRadius * 1.25,
          (event) => {
            const nodeContainer = event.target.parentNode.parentNode.parentNode;
            if (node.isLocked) this.unlockNodePosition(nodeContainer, node);
            else this.lockNodePosition(nodeContainer, node, node.x!, node.y!, true);
          },
          `icons/${node.isLocked ? 'unlockNode' : 'lockNode'}.svg`,
        ),
      50,
    );

    // information button
    this.drawNodeMenuButton(
      menuG,
      -nodeMenuBtnRadius * 3.75,
      () => {
        this.onSelectNode(node);
      },
      'icons/goToDetailView.svg',
    );
    this.nodeMenu = menuG;
  };

  hideNodeMenu = () => {
    if (this.nodeMenu) {
      this.nodeMenu.remove();
      this.nodeMenu = undefined;
    }
  };

  toggleEdgeLabelsVisibility = () => {
    this.edgeLabelsVisible = !this.edgeLabelsVisible;

    const edges = this.edgeSvg.selectAll(edgeClassName);

    const edgeLabel1 = edges.selectChild(this.selectEdgeLabel1);
    const edgeLabel2 = edges.selectChild(this.selectEdgeLabel2);

    if (!this.edgeLabelsVisible) {
      edgeLabel1.style('opacity', 0);
      edgeLabel2.style('opacity', 0);
      return;
    }

    const edgeLabelFontSize = this.getEdgeLabelFontSize();
    const edgeLabelOpacity = this.getEdgeLabelOpacity();

    edgeLabel1.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
    edgeLabel2.attr('font-size', edgeLabelFontSize).style('opacity', edgeLabelOpacity);
  };

  drawNodes = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes, (node) => (node as GraphNode).id)
      .join((enter) => {
        const g = enter.append('g');
        g.append('circle')
          .attr('r', nodeRadius)
          .attr('fill', (node) => common.changeColorBasedOnType(node.type))
          .attr('stroke', '#aaa')
          .on('click', (event: PointerEvent, node) => {
            if (!event.target) return;
            const menu = (event.target as SVGElement).parentNode as SVGGElement;
            this.showNodeMenu(node, d3.select(menu));
          });
        // Lock icon. The icon is always in the DOM, just with 0 opacity when hidden, to prevent unnecessary loading
        // of files and because otherwise the whole DOM would be scanned when toggling a single node's position.
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
            // split the text into two lines if it's more than 20 characters
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
    // Translate the DOM element
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
    // Update the positions in the simulation
    g.selectChild(this.selectNodeOrEdge)
      .attr('x1', (edge: any) => edge.source.x - (edge.source.x + edge.target.x) / 2)
      .attr('y1', (edge: any) => edge.source.y - (edge.source.y + edge.target.y) / 2)
      .attr('x2', (edge: any) => edge.target.x - (edge.source.x + edge.target.x) / 2)
      .attr('y2', (edge: any) => edge.target.y - (edge.source.y + edge.target.y) / 2);

    // If FPS is low, skip some frames for edge label translations, as these are by far the most demanding
    if (this.fpsCounter.fps < 60 && !this.shouldRenderEdgeLabel()) return;
    g.selectChild(this.selectEdgeLabel1).each(function (edge) {
      const position = common.getRotationAndPosition(edge);
      const thisEdge = d3.select(this);
      thisEdge.attr(
        'transform',
        `translate(${[position.x, position.y]}), rotate(${position.degree})`,
      );
      const text = common.createEdgeLabelText(edge.sourceToTarget, position.flip);
      if (thisEdge.text() !== text) {
        thisEdge.text(text);
      }
    });
    g.selectChild(this.selectEdgeLabel2).each(function (edge) {
      const position = common.getRotationAndPosition(edge);
      const thisEdge = d3.select(this);
      thisEdge.attr(
        'transform',
        `translate(${[position.x, position.y]}), rotate(${position.degree})`,
      );
      const text = common.createEdgeLabelText(edge.targetToSource, !position.flip);
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

  drawNodeMenuButton = (
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

  redrawGraphWithFilter = () => {
    this.nodes = this.unfilteredNodes.filter(this.nodeFilter);
    this.edges = this.unfilteredEdges.filter(this.edgeFilter);
    this.removeDisconnectedNodes();
    this.removeDisconnectedEdges();
    this.resetForceSimulation();
    this.drawGraph();
  };

  // ############################################
  // Locking and Unlocking Node Positions
  // ############################################

  /*
    Wrapper function for localUnlockAllNodes. This is necessary because the function is called from Graph component,
    which does not have access to the parameters required.
    It was necessary to pass the unlockNode callback because localUnlockAllNodes calls a function on each node which
    uses 'this' to select the current DOM element. This is possible because the 'function' keyword, unlike arrow
    functions, rebind 'this' from the GraphSimulation object to the caller of the function, i.e. the DOM element.
    However, as 'this' no longer represents the GraphSimulation object, we cannot use 'this.unlockNode'.
  */
  unlockAllNodes = () => {
    this.localUnlockAllNodes(this.unlockNodePosition);
  };

  localUnlockAllNodes = (
    unlockNode: (
      nodeContainer: SVGGElement,
      node: GraphNode,
      shouldRenderEdgeLabel: boolean,
    ) => void,
  ) => {
    let hasUpdatedNode = false;
    this.hideNodeMenu();
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .each(function (node) {
        const nodeContainer = d3.select(this).node() as SVGGElement;
        if (node.isLocked) {
          hasUpdatedNode = true;
        }
        unlockNode(nodeContainer, node, false);
      });

    // Only restart the force simulation if a change has actually been made to the nodes or edges.
    if (hasUpdatedNode) {
      this.forceSimulation.alpha(0.5);
      this.forceSimulation.restart();
    }
  };

  unlockNodePosition = (
    nodeContainer: SVGGElement,
    node: GraphNode,
    shouldReRenderGraph: boolean = true,
  ): void => {
    const n = node;
    n.fx = undefined;
    n.fy = undefined;
    n.isLocked = false;
    d3.select(nodeContainer).selectChild(this.selectNodeLockIcon).style('opacity', 0);
    if (shouldReRenderGraph) {
      this.forceSimulation.alpha(0.5);
      this.forceSimulation.restart();
    }
  };

  lockNodePosition = (
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

  // ############################################
  // Scale & Zoom
  // ############################################
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

  // Applies zoom to all the elements of the graph
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

  // ############################################
  // Event Listeners
  // ############################################

  registerDragNodeEvent = () => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)

      .call(
        d3
          .drag()
          .on('drag', (event, value) => {
            const node = value as GraphNode;
            this.lockNodePosition(
              event.sourceEvent.target.parentNode,
              node,
              event.x,
              event.y,
              !node.isLocked!,
            );
            this.forceSimulation.alpha(0.5);
            this.forceSimulation.restart();
          })
          .on('end', (event, d) => {
            if (!event.sourceEvent.target) return;
            const menu = (event.sourceEvent.target as SVGElement).parentNode as SVGGElement;
            this.showNodeMenu(d as GraphNode, d3.select(menu));
          }) as any,
      );
  };

  // Adds an event listener to mouseover node callback
  registerMouseoverNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectNodeOrEdge)
      .on('mouseover', (event: MouseEvent, node) => {
        if (!event.target) return;
        // increase node radius
        d3.select(event.target as SVGCircleElement)
          .transition('500')
          .attr('r', nodeRadius * nodeHighlightRadiusMultiplier)
          .attr('stroke-width', 3 / this.scale)
          .attr('stroke', edgeHighlightColor);

        // make ingoing and outgoing edges and edge labels bold
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

  // Adds an event listener to mouseout node callback
  registerMouseoutNodeEvent = (edgeSvg: SubSvgSelection, edges: Array<D3Edge | GraphEdge>) => {
    this.nodeSvg
      .selectAll(nodeClassName)
      .data(this.nodes)
      .selectChild(this.selectNodeOrEdge)
      .on('mouseout', (event: MouseEvent, node) => {
        if (!event.target) return;
        // reset radius
        d3.select(event.target as SVGCircleElement)
          .transition('500')
          .attr('r', nodeRadius)
          .attr('stroke-width', 0);

        // reset edge and edge labels boldness
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

  // ############################################
  // Other
  // ############################################

  // Called by the Graph component to change the callback called when a node is expanded
  updateOnExpandCallback = (callback: (node: GraphNode) => void) => {
    this.onExpandNode = callback;
  };

  getNodeMenuPosition = () => {
    const yPos = -nodeRadius * nodeHighlightRadiusMultiplier - 15 / this.scale;
    return { x: 0, y: yPos, scale: 1 / this.scale };
  };

  getEdgeLabelFontSize = () => Math.min(fontSize / this.scale, maxEdgeFontSize);

  getNodeLabelFontSize = () => (this.scale <= 0.6 ? fontSize / 0.6 : fontSize / this.scale);

  // ############################################
  // Maybe move to external file
  // ############################################

  // can be moved if scale is paramenter
  getEdgeLabelOpacity = () => {
    if (this.scale >= 1) return 1;
    if (this.scale > 0.9) return normalizeScale(this.scale, 0.9, 1);
    return 0;
  };

  /*
    Simple functions to select specific elements in the DOM. For example, a node contains a circle, label and lock icon.
    Because these are just selected from the DOM, they must be selected based on their sibling index in the DOM. To
    avoid having to remember all the indices, these functions were made.
  */
  selectNodeOrEdge = (_: any, index: number) => index === 0;
  selectEdgeLabel1 = (_: any, index: number) => index === 1;
  selectEdgeLabel2 = (_: any, index: number) => index === 2;
  selectNodeLockIcon = (_: any, index: number) => index === 1;
  selectNodeLabel = (_: any, index: number) => index === 2;

  /*
    Determines whether edge labels should be rendered. As edge labels are by far the most demanding part of the render
    cycle, the labels skip frames if the user's FPS is low.
  */
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
