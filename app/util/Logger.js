import jsLogger from 'js-logger';
import { appConfig } from '../config/app.config.js';

jsLogger.useDefaults({
  defaultLevel: jsLogger[appConfig.logger[process.env.NODE_ENV].level]
});

export default jsLogger;
