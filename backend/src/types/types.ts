import { Prefix } from '@innotrade/enapso-graphdb-client';

export type OntologyEntity = {
  prefix: Prefix;
  id: string;
  name: string;
};
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
  Predicate: string;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | undefined) {
    super(message);
    this.statusCode = statusCode;
  }
}
