import { ApiError, CLEAR_ERROR, ErrorState, ErrorStateAction, SET_ERROR } from '../../types';

const defaultState: ErrorState = {
  apiError: null,
};

const reducer = (state: ErrorState = defaultState, action: ErrorStateAction): ErrorState => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        apiError: action.payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        apiError: null,
      };
    default:
      return state;
  }
};

export const setError = (error: ApiError): ErrorStateAction => ({
  type: 'SET_ERROR',
  payload: error,
});

export const clearError = (): ErrorStateAction => ({ type: 'CLEAR_ERROR' });

export default reducer;
