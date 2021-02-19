// eslint-disable-next-line import/no-cycle
import { ApiError } from './api/api';

export type Node = {
  id: string;
  name: string;
  prefix: Prefix;
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

export type Prefix = {
  prefix: string;
  iri: string;
};

export type ErrorState = null | ApiError;

export type ErrorStateAction = {
  type: string;
  payload: ErrorState;
};
