import {appConfig} from './config/app.config.js';
import i18n from './i18n';
import { EventLogger } from './util/EventLogger.js';

const websocket = new WebSocket(appConfig.websocket[process.env.NODE_ENV]);

/**
 * Handles server messages. If a message property is set in the server message,
 * an antd message box will be shown with its value.
 * @param  {event} msg the websocket event.
 */
websocket.onmessage = msgString => {
  const msg = JSON.parse(msgString.data);
  let {
    // Rendered as textbody
    message,
    // Rendered as title
    type,
    // Wheiter to hide the antd message. OPTIONAL
    noPopup
  } = msg;
  if (!message) {
    return;
  }
  if (i18n.exists(message)) {
    message = i18n.t(message);
  }
  EventLogger.log(message, type, 'WebSocket', !noPopup);
};

/**
 *
 * Handles server onclose event. And shows a warn message.
 */
websocket.onclose = () => {
  EventLogger.log(i18n.t('WebSocket.closedByServer'), 'warn', 'WebSocket', true);
};

export default websocket;
