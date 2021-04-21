import { CorrelationFilter, Node } from '../ontologyTypes';

export type SetCorrelationFilterPayload = {
  isPositive: boolean;
  index: number;
};

export type OntologyState = {
  selectedNode?: Node;
  correlationFilter: CorrelationFilter;
};

export type SelectNodeAction = {
  type: typeof SELECT_NODE;
  payload: Node;
};

export type ClearSelectedNodeAction = {
  type: typeof CLEAR_SELECTED_NODE;
};

export type SetCorrelationFilterAction = {
  type: typeof SET_CORRELATION_FILTER;
  payload: SetCorrelationFilterPayload;
};

export type OntologyStateAction =
  | SelectNodeAction
  | ClearSelectedNodeAction
  | SetCorrelationFilterAction;

export const SELECT_NODE = 'SELECT_NODE';
export const CLEAR_SELECTED_NODE = 'CLEAR_SELECTED_NODE';
export const SET_CORRELATION_FILTER = 'SET_CORRELATION_FILTER';
