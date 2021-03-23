import { SimulationNodeDatum } from 'd3';

export type Annotation = {
  label: string;
  description: string;
};

export type SustainabilityGoal = {
  instancesOf: string;
  label: string;
  icon: string;
};

export interface SubGoal extends Node {
  SubjectLabel: string;
  description: string;
}

export interface UniqueObject {
  id: string;
}

export type Correlation = {
  Object: Node;
  harHøyKorrelasjon: string | null;
  harModeratKorrelasjon: string | null;
  harLavKorrelasjon: string | null;
};

export interface Node extends UniqueObject {
  name: string;
  prefix: Prefix;
}

export interface GraphNode extends Node, SimulationNodeDatum {}

export interface Edge extends UniqueObject {
  name: string;
  prefix: Prefix;
}

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
