import { Prefix } from '@innotrade/enapso-graphdb-client';

export interface OntologyEntity {
  prefix: Prefix;
  id: string;
  name: string;
  type: string;
  correlation: number; // -1 = undefined, 0 = low, 1 = medium, 2 = high
}

export interface SubGoal extends Node {
  description: string;
}

export interface Node extends OntologyEntity {}

export interface Edge extends OntologyEntity {}

export type Ontology = {
  Subject: Node | null;
  Object: Node | null;
  Predicate: Edge | null;
};

export type Record = {
  Subject: string | null;
  SubjectLabel: string | null;
  Object: string | null;
  ObjectLabel: string | null;
  TypeLabel: string | null;
  Predicate: string;
  High: string | null;
  Moderate: string | null;
  Low: string | null;
};

export type Annotation = {
  label: string;
  description: string;
};
