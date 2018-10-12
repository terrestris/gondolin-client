import {
  createStore,
  applyMiddleware
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducer from '../reducers/Reducer';
import initialState from './initialState';

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
);

export default store;
