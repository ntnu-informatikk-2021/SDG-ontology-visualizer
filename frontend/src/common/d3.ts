import { Node, GraphEdge, GraphNode, Ontology, UniqueObject } from '../types/ontologyTypes';

export const mapOntologyToGraphEdge = (ontology: Ontology): GraphEdge => ({
  id: ontology.Predicate.id,
  source: ontology.Subject.id,
  target: ontology.Object.id,
  sourceToTarget: ontology.Predicate,
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

export const getTranselatedRotationAndPosition = (link: any, margin: number) => {
  let degree =
    (Math.atan2(link.target.y - link.source.y, link.target.x - link.source.x) * 180) / Math.PI;
  let radian = degree / 180;
  let position = [0, 0];

  if (degree >= 90) {
    radian = ((degree - 90) * 2) / 180;
    position = [-(1 - radian) * margin, -radian * margin];
    degree -= 180;
  } else if (degree >= 0) {
    radian = (degree * 2) / 180;
    position = [radian * margin, -(1 - radian) * margin];
  } else if (degree >= -90) {
    radian = (degree * 2) / 180;
    position = [radian * margin, -(1 + radian) * margin];
  } else if (degree >= -180) {
    radian = ((degree + 90) * 2) / 180;
    position = [(1 + radian) * margin, radian * margin];
    degree += 180;
  }
  return { position, degree };
};
