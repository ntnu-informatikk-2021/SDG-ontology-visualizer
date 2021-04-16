import { combineReducers, createStore } from 'redux';
import apiErrorReducer from './reducers/apiErrorReducer';
import ontologyReducer from './reducers/ontologyReducer';
import fullscreenReducer from './reducers/fullscreenReducer';

const rootReducer = combineReducers({
  apiError: apiErrorReducer,
  ontology: ontologyReducer,
  fullscreenStatus: fullscreenReducer,
});
const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
