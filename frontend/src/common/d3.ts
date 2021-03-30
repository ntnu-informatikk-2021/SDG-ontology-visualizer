import { Node, GraphEdge, GraphNode, Ontology, UniqueObject } from '../types/ontologyTypes';

// eslint-disable-next-line import/prefer-default-export
export const mapOntologyToGraphEdge = (ontology: Ontology): GraphEdge => ({
  ...ontology.Predicate,
  source: ontology.Subject.id,
  target: ontology.Object.id,
});

export const removeDuplicates = <T extends UniqueObject>(
  node: T,
  index: number,
  self: T[],
): boolean => index === self.findIndex((n) => node.id === n.id);

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
