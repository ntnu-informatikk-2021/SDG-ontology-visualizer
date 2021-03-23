import { Prefix } from '@innotrade/enapso-graphdb-client';

export type OntologyEntity = {
  prefix: Prefix;
  id: string;
  name: string;
};
export interface SubGoal extends Node {
  description: string;
}
export type Correlation = {
  Object: Node | null;
  harHøyKorrelasjon: string | null;
  harModeratKorrelasjon: string | null;
  harLavKorrelasjon: string | null;
};

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
  HarHøyKorrelasjon: string | null;
  HarModeratKorrelasjon: string | null;
  HarLavKorrelasjon: string | null;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string | undefined) {
    super(message);
    this.statusCode = statusCode;
  }
}
