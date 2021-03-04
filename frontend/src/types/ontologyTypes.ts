export type Node = {
  id: string;
  name: string;
  prefix: Prefix;
};

export type Edge = {
  id: string;
  name: string;
};

export type Ontology = {
  Subject: Node;
  Object: Node;
  Predicate: Edge;
};

export type Prefix = {
  prefix: string;
  iri: string;
};
