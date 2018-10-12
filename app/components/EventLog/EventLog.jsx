import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import './EventLog.less';
import { Alert } from 'antd';
import { removeEvent } from '../../actions/AppEventsAction';

@connect(store => {
  return {
    appEvents: store.appEvents
  };
})
@translate()
class EventLog extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    appEvents: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func
  };

  static defaultProps = {
    appEvents: []
  };

  /**
   * Get the log entries from the appEvents.
   */
  getLogEntries = () => {
    const {
      appEvents,
      dispatch
    } = this.props;
    return appEvents.map(event => {
      let {
        timestamp,
        context,
        text,
        type
      } = event;

      const message = <div>
        {context ? <span className="log-context">{context} – </span> : null}
        <span className="log-timestamp">{timestamp.format('LTS')} </span>
        <div className="log-text">{text}</div>
      </div>;

      return (
        <Alert
          className={'log'}
          key={`log-${timestamp.valueOf()}`}
          message={message}
          type={type}
          banner
          showIcon
          closable
          onClose={() => dispatch(removeEvent(event))}
        />
      );
    });
  }

  render() {
    return (
      <div className="event-log">
        {this.getLogEntries()}
      </div>
    );
  }
}

export default EventLog;
