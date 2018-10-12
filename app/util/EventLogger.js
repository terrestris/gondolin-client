import store from '../store/store';
import { addEvent } from '../actions/AppEventsAction';
import { message } from 'antd';
import moment from 'moment';
moment.locale();

/**
 * The EventLogger.
 *
 * @class
 */
export class EventLogger {

  /**
   * Adds a message to the appEvents of the store and shows an antd message if
   * configured.
   *
   * @param {String} text The message which should be displayed.
   * @param {string} [type='info'] 'error', 'warning', 'success', 'info'
   * @param {String} context The Context ('Authentication', 'Import', …)
   * where the log comes from
   * @param {boolean} [withMessage=false] true to show an antdmessage additonaly
   * @static
   */
  static log(text, type = 'info', context, withMessage = false) {
    const event = {
      timestamp: moment(),
      text,
      type,
      context
    };
    if (type === 'warn') {
      event.type = 'warning';
    }
    store.dispatch(addEvent(event));

    if (withMessage || type === 'error') {
      message[type](text);
    }
  }

}

export default EventLogger;
