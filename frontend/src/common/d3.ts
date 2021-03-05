import { GraphEdge, Ontology } from '../types/ontologyTypes';

// eslint-disable-next-line import/prefer-default-export
export const mapOntologyToGraphEdge = (ontology: Ontology): GraphEdge => ({
  ...ontology.Predicate,
  source: ontology.Subject.id,
  target: ontology.Object.id,
});
