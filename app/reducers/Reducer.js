import {
  combineReducers
} from 'redux';
import {
  routerReducer as routing
} from 'react-router-redux';

import app from './AppReducer';
import appEvents from './AppEventsReducer';

const reducer = combineReducers({
  routing,
  app,
  appEvents
});

export default reducer;
