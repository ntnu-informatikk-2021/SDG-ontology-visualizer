import { Node } from '../ontologyTypes';

export type OntologyState = {
  selectedNode?: Node;
};

export type SelectNodeAction = {
  type: typeof SELECT_NODE;
  payload: Node;
};

export type ClearSelectedNodeAction = {
  type: typeof CLEAR_SELECTED_NODE;
};

export type OntologyStateAction = SelectNodeAction | ClearSelectedNodeAction;

export const SELECT_NODE = 'SELECT_NODE';
export const CLEAR_SELECTED_NODE = 'CLEAR_SELECTED_NODE';
