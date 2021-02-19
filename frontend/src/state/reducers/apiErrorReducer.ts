/* eslint-disable import/no-cycle */
import { ApiError } from '../../api/api';
import { ErrorState, ErrorStateAction } from '../../types';
import store from '../store';

const defaultState: ErrorState = {
  apiError: null,
};

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

const reducer = (state: ErrorState = defaultState, action: ErrorStateAction): ErrorState => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        apiError: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        apiError: null,
      };
    default:
      return state;
  }
};

export const setError = (error: ApiError): void => {
  store.dispatch({
    type: 'SET_ERROR',
    payload: error,
  });
};

export const clearError = (): void => {
  store.dispatch({ type: 'CLEAR_ERROR' });
};

export default reducer;
