import { SimulationNodeDatum } from 'd3';

export type Node = {
  id: string;
  name: string;
  prefix: Prefix;
};

export type Annontations = {
  label: string;
  description: string;
};

export interface GraphNode extends Node, SimulationNodeDatum {}

export type Edge = {
  id: string;
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
