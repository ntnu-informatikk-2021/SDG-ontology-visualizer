import { SimulationNodeDatum } from 'd3';

export type Annotation = {
  label: string;
  description: string;
  moreInformation: string | null;
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

export interface Node extends UniqueObject {
  name: string;
  type: string;
  prefix: Prefix;
  correlation: number;
}

export interface GraphNode extends Node, SimulationNodeDatum {
  isLocked?: boolean;
  lockedX?: number;
  lockedY?: number;
  color?: string;
  type: string;
}

export interface Edge extends UniqueObject {
  name: string;
  prefix: Prefix;
}

export interface GraphEdge extends Edge {
  source: string;
  target: string;
  sourceToTarget: Edge[];
  targetToSource: Edge[];
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
