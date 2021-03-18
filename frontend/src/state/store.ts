import { combineReducers, createStore } from 'redux';
import apiErrorReducer from './reducers/apiErrorReducer';
import ontologyReducer from './reducers/ontologyReducer';

const rootReducer = combineReducers({ apiError: apiErrorReducer, ontology: ontologyReducer });
const store = createStore(rootReducer);

export type RootState = ReturnType<typeof rootReducer>;

export default store;
