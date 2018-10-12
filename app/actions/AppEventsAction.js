export const ADD_EVENT = 'ADD_EVENT';
export const REMOVE_EVENT = 'REMOVE_EVENT';

export function addEvent(event) {
  return {
    type: ADD_EVENT,
    event
  };
}

export function removeEvent(event) {
  return {
    type: REMOVE_EVENT,
    event
  };
}
