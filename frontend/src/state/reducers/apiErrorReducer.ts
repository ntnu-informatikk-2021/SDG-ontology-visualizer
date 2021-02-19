// eslint-disable-next-line import/no-cycle
import { ErrorState, ErrorStateAction } from '../../types';

const defaultState = {
  apiError: <ErrorState>null,
};

const reducer = (state = defaultState, action: ErrorStateAction) => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        apiError: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
