import { GraphEdge, Ontology } from '../types/ontologyTypes';

// eslint-disable-next-line import/prefer-default-export
export const mapOntologyToGraphEdge = (ontology: Ontology): GraphEdge => ({
  ...ontology.Predicate,
  source: ontology.Subject.id,
  target: ontology.Object.id,
});

interface SomethingWithId {
  id: string;
}
export const removeDuplicates = <T extends SomethingWithId>(
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
