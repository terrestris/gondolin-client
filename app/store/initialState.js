import {
  appConfig
} from '../config/app.config.js';

export default {
  mapView: appConfig.mapView,
  app: {
    config: appConfig,
    language: 'de',
    eventLogVisible: false,
    user: null
  },
  appEvents: []
};
