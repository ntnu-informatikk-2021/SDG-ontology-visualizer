/* eslint-disable import/no-cycle */
import { ApiError } from './api/api';
import { CLEAR_ERROR, SET_ERROR } from './state/reducers/apiErrorReducer';

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
