/**
 * Action types
 */
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const TOGGLE_LEGEND = 'TOGGLE_LEGEND';
export const TOGGLE_IMPRINT = 'TOGGLE_IMPRINT';
export const TOGGLE_FEATURE_GRID = 'TOGGLE_FEATURE_GRID';
export const TOGGLE_EVENT_LOG = 'TOGGLE_EVENT_LOG';
export const SET_USER = 'SET_USER';

/**
 * Action creators
 */
export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    language
  };
}

export function toggleEventLog() {
  return {
    type: TOGGLE_EVENT_LOG
  };
}

export function toggleImprint() {
  return {
    type: TOGGLE_IMPRINT
  };
}

export function toggleFeatureGrid() {
  return {
    type: TOGGLE_FEATURE_GRID
  };
}

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}
