export type Node = {
  id: string;
  name: string;
};

export type Edge = {
  id: string;
  name: string;
};

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
