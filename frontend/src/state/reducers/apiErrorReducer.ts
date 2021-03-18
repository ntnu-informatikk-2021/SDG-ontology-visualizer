import { CLEAR_ERROR, ErrorState, ErrorStateAction, SET_ERROR } from '../../types/redux/errorTypes';

const defaultState: ErrorState = {
  error: null,
};

const apiErrorReducer = (
  state: ErrorState = defaultState,
  action: ErrorStateAction,
): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const setError = (error: Error): ErrorStateAction => ({
  type: 'SET_ERROR',
  payload: error,
});

export const clearError = (): ErrorStateAction => ({ type: 'CLEAR_ERROR' });

export default apiErrorReducer;
