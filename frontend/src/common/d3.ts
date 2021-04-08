import { D3Edge, LabelTransform } from '../types/d3/simulation';
import { GraphEdge, GraphNode, Ontology, UniqueObject, Edge } from '../types/ontologyTypes';
import { mapIdToEdge } from './node';

export const mapOntologyToGraphEdge = (ontology: Ontology): GraphEdge => {
  const edge = mapIdToEdge(ontology.Predicate.id);
  if (!edge) throw new Error('Could not map ontology to graph edge');
  return {
    ...edge,
    source: ontology.Subject.id,
    target: ontology.Object.id,
    sourceToTarget: [ontology.Predicate],
    targetToSource: [],
  };
};

export const removeDuplicates = <T extends UniqueObject>(
  node: T,
  index: number,
  self: T[],
): boolean => index === self.findIndex((n) => node.id === n.id);

export const mergeParallelEdges = (
  edge: GraphEdge | D3Edge,
  _: number,
  self: Array<GraphEdge | D3Edge>,
): boolean =>
  self.every((e) => {
    if (edge.sourceToTarget.some((child) => child.id === e.sourceToTarget[0].id)) {
      return true;
    }
    if (edge.targetToSource.some((child) => child.id === e.sourceToTarget[0].id)) {
      return true;
    }
    if (e.sourceToTarget.some((child) => child.id === edge.sourceToTarget[0].id)) {
      return false;
    }
    if (e.targetToSource.some((child) => child.id === edge.sourceToTarget[0].id)) {
      return false;
    }
    if (edge.source === e.target && edge.target === e.source) {
      edge.targetToSource.push(...e.sourceToTarget);
      return true;
    }
    if (edge.source === e.source && edge.target === e.target) {
      edge.sourceToTarget.push(...e.sourceToTarget);
      return true;
    }
    return true;
  });

export const makePredicateUnique = (ontology: Ontology): Ontology => ({
  ...ontology,
  Predicate: {
    ...ontology.Predicate,
    id: ontology.Predicate.id + ontology.Subject.id + ontology.Object.id,
  },
});
export const changeColorBasedOnType = (type: string) => {
  let nodeColor = '#4299e1';
  if (type.includes('SDG')) nodeColor = '#EA5F41';
  if (type.includes('Trippel bunnlinje')) nodeColor = '#85E664';
  if (type.includes('Delmål')) nodeColor = '#E0E73F';
  return nodeColor;
};
export const mapNodeToGraphNodeAtDefaultPosition = (x?: number, y?: number) => (
  node: GraphNode,
) => {
  if (node.x) return node; // if node is already a GraphNode, just return it
  const newNode: GraphNode = node;
  newNode.x = x;
  newNode.y = y;
  newNode.vx = 0;
  newNode.vy = 0;
  return newNode;
};

export const mapOntologyToNonClickedGraphNode = (clickedNode: GraphNode) => (
  ontology: Ontology,
): GraphNode => (ontology.Subject.id === clickedNode.id ? ontology.Object : ontology.Subject);

export const isD3Edge = (edge: GraphEdge | D3Edge) => typeof edge.target === 'string';
export const isGraphEdge = (edge: GraphEdge | D3Edge) => typeof edge.target !== 'string';

export const getRotationAndPosition = (edge: any): LabelTransform => {
  let degree =
    (Math.atan2(edge.target.y! - edge.source.y!, edge.target.x! - edge.source.x!) * 180) / Math.PI;
  let radian = degree / 180;
  let x = 0;
  let y = 0;
  let flip = false;
  if (degree >= 90) {
    radian = ((degree - 90) * 2) / 180;
    x = -(1 - radian);
    y = -radian;
    degree -= 180;
    flip = true;
  } else if (degree >= -90) {
    radian = (degree * 2) / 180;
    x = radian;
    y = -(1 + radian);
    flip = false;
  } else if (degree >= -180) {
    radian = ((degree + 90) * 2) / 180;
    x = 1 + radian;
    y = radian;
    degree += 180;
    flip = true;
  }
  return { x, y, degree, flip };
};

const addDirectionArrowToEdgeLabelText = (text: string, direction: boolean): string => {
  if (direction) return `<-- ${text}`;
  return `${text} -->`;
};

export const createEdgeLabelText = (edge: Edge[], flipDirection: boolean): string => {
  switch (edge.length) {
    case 0:
      return '';
    case 1:
      return addDirectionArrowToEdgeLabelText(edge[0].name, flipDirection);
    default:
      return addDirectionArrowToEdgeLabelText(`${edge.length} Predicates`, flipDirection);
  }
};

export const removingNodeWillMakeGraphEmpty = (
  node: GraphNode,
  edges: Array<D3Edge | GraphEdge>,
): boolean =>
  edges.every((edge) => {
    const source = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const target = typeof edge.target === 'string' ? edge.target : edge.target.id;
    return node.id === source || node.id === target;
  });
