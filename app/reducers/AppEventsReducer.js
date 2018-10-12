import {
  ADD_EVENT,
  REMOVE_EVENT
} from '../actions/AppEventsAction';

import initialState from '../store/initialState';

function applicationEvents(appEvents = initialState.appEvents, action) {
  switch (action.type) {
    case ADD_EVENT:
      return [...appEvents, action.event];
    case REMOVE_EVENT:
      return appEvents.filter(event => {
        const textMatch = event.text === action.event.text;
        const timestampMatch = event.timestamp.isSame(action.event.timestamp);
        return !(textMatch && timestampMatch);
      });
    default:
      return appEvents;
  }
}

export default applicationEvents;
