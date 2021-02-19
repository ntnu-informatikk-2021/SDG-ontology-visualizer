import { createStore } from 'redux';
import apiErrorReducer from './reducers/apiErrorReducer';

const store = createStore(apiErrorReducer);

export default store;
