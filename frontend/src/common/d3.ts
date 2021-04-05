import { D3Edge } from '../types/d3/simulation';
import { Node, GraphEdge, GraphNode, Ontology, UniqueObject, Edge } from '../types/ontologyTypes';
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

// Vet ikke heelt hvorfor eslint ikke arresterer meg på den push metoden der.
// Funker med destructuring også.
// Denne kan sikkert også gjøres smartere, den er jo ikke akkurat effektiv.
// Har endret sourceToTarget til å være 2 lister.
export const mergeParallelEdges = (
  edge: GraphEdge | D3Edge,
  _: number,
  self: Array<GraphEdge | D3Edge>,
): boolean =>
  self.every((e) => {
    if (!edge.sourceToTarget.every((child) => child.id !== e.sourceToTarget[0].id)) {
      console.log('true');
      return true;
    }
    if (!edge.targetToSource.every((child) => child.id !== e.sourceToTarget[0].id)) {
      return true;
    }
    if (!e.sourceToTarget.every((child) => child.id !== edge.sourceToTarget[0].id)) {
      return false;
    }
    if (!e.targetToSource.every((child) => child.id !== edge.sourceToTarget[0].id)) {
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
): Node => (ontology.Subject.id === clickedNode.id ? ontology.Object : ontology.Subject);

export const getRotationAndPosition = (edge: any) => {
  let degree =
    (Math.atan2(edge.target.y - edge.source.y, edge.target.x - edge.source.x) * 180) / Math.PI;
  let radian = degree / 180;
  let position = [0, 0];
  let flip = false;
  if (degree >= 90) {
    radian = ((degree - 90) * 2) / 180;
    position = [-(1 - radian), -radian];
    degree -= 180;
    flip = true;
  } else if (degree >= -90) {
    radian = (degree * 2) / 180;
    position = [radian, -(1 + radian)];
    flip = false;
  } else if (degree >= -180) {
    radian = ((degree + 90) * 2) / 180;
    position = [1 + radian, radian];
    degree += 180;
    flip = true;
  }
  return { position, degree, flip };
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
