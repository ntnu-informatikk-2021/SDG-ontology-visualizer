export type Node = {
  id: string;
  name: string;
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
