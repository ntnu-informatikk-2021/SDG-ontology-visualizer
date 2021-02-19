import { createStore } from 'redux';
import reducer from './reducers/apiErrorReducer';

const store = createStore(reducer);

export default store;
