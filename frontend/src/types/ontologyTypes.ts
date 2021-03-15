import { SimulationNodeDatum } from 'd3';

export interface UniqueObject {
  id: string;
}

export interface Node extends UniqueObject {
  name: string;
  prefix: Prefix;
}

export interface GraphNode extends Node, SimulationNodeDatum {}

export interface Edge extends UniqueObject {
  name: string;
  prefix: Prefix;
};

export interface GraphEdge extends Edge {
  source: string;
  target: string;
}

export type Ontology = {
  Subject: Node;
  Object: Node;
  Predicate: Edge;
};

export type Prefix = {
  prefix: string;
  iri: string;
};
