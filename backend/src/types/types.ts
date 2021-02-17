export type OntologyEntity = {
  id: string;
  name: string;
};

export interface Node extends OntologyEntity {}

export interface Edge extends OntologyEntity {}

export type Ontology = {
  Subject: Node | null;
  Object: Node | null;
  Predicate: Edge;
};

export type Record = {
  Subject: string | null;
  Object: string | null;
  Predicate: string;
};
