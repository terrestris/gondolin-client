import {
  SET_LANGUAGE,
  TOGGLE_EVENT_LOG,
  TOGGLE_IMPRINT,
  TOGGLE_FEATURE_GRID,
  SET_USER
} from '../actions/AppAction';

import initialState from '../store/initialState';

function app(app = initialState.app, action) {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...app,
        language: action.language
      };
    case TOGGLE_EVENT_LOG:
      return {
        ...app,
        eventLogVisible: !app.eventLogVisible
      };
    case TOGGLE_IMPRINT:
      return {
        ...app,
        imprintVisible: !app.imprintVisible
      };
    case TOGGLE_FEATURE_GRID:
      return {
        ...app,
        featureGridVisible: !app.featureGridVisible
      };
    case SET_USER:
      return {
        ...app,
        user: action.payload
      };
    default:
      return app;
  }
}

export default app;
