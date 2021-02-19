import { createStore } from 'redux';
// eslint-disable-next-line import/no-cycle
import reducer from './reducers/apiErrorReducer';

const store = createStore(reducer);

export default store;
