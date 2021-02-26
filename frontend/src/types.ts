import { SimulationNodeDatum } from 'd3';

export type Node = {
  id: string;
  name: string;
  prefix: Prefix;
};

export interface GraphNode extends Node, SimulationNodeDatum {}

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

export class ApiError extends Error {
  status: string;
  body: any;

  constructor(res: any, body: any) {
    super(body.message || res.statusText);
    this.status = res.status;
    this.name = 'ApiError';
    this.body = body;
  }
}

export type ErrorState = {
  apiError: ApiError | null;
};

export type SetErrorStateAction = {
  type: typeof SET_ERROR;
  payload: ApiError;
};

export type ClearErrorStateAction = {
  type: typeof CLEAR_ERROR;
};

export type ErrorStateAction = SetErrorStateAction | ClearErrorStateAction;

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
