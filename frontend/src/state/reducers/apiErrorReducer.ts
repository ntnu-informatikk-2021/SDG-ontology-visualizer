import {
  ApiError,
  CLEAR_ERROR,
  ErrorState,
  ErrorStateAction,
  SET_ERROR,
} from '../../types/apiTypes';

const defaultState: ErrorState = {
  apiError: null,
};

const apiErrorReducer = (
  state: ErrorState = defaultState,
  action: ErrorStateAction,
): ErrorState => {
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

export default apiErrorReducer;
