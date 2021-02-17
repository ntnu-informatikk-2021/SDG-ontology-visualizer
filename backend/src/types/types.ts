import { Prefix } from '@innotrade/enapso-graphdb-client';

export type OntologyEntity = {
  prefix: Prefix;
  id: string;
  name: string;
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
  Object: string | null;
  Predicate: string;
};
