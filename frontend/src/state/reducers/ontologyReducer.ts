import {
  CLEAR_SELECTED_NODE,
  OntologyState,
  OntologyStateAction,
  SELECT_NODE,
} from '../../types/redux/ontologyTypes';
import { Node } from '../../types/ontologyTypes';

const defaultState: OntologyState = {
  selectedNode: undefined,
};

const ontologyReducer = (
  state: OntologyState = defaultState,
  action: OntologyStateAction,
): OntologyState => {
  switch (action.type) {
    case SELECT_NODE:
      return {
        ...state,
        selectedNode: action.payload,
      };
    case CLEAR_SELECTED_NODE:
      return defaultState;
    default:
      return state;
  }
};

export const selectNode = (node: Node): OntologyStateAction => ({
  type: 'SELECT_NODE',
  payload: node,
});

export const clearSelectedNode = (): OntologyStateAction => ({ type: 'CLEAR_SELECTED_NODE' });

export default ontologyReducer;
