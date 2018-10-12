import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { connect } from 'react-redux';

import {SimpleButton} from '@terrestris/react-geo';
import './EventLogButton.less';

import {toggleEventLog} from '../../../actions/AppAction';
import { Badge } from 'antd';

@connect(store => {
  return {
    appEvents: store.appEvents
  };
})
@translate()
class EventLogButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    appEvents: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func
  };

  static defaultProps = {
    appEvents: []
  };

  onButtonClick = () => {
    this.props.dispatch(toggleEventLog());
  }

  render() {
    const {
      appEvents,
      t
    } = this.props;

    const empty = appEvents.length === 0;
    const containsErrors = appEvents.some(event => event.type == 'error');
    const status = !empty ? appEvents[appEvents.length - 1].type : 'default';
    const statusClass = containsErrors ? 'error' : status;

    return (
      <Badge
        id="event-log-button"
        className="headerbutton event-log-button"
        status={empty ? undefined : status}
      >
        <SimpleButton
          className={`event-log-button-button status-${statusClass}`}
          tooltip={t('EventLog.eventLog')}
          type="primary"
          onClick={this.onButtonClick}
          icon="list-alt"
        />
      </Badge>
    );
  }
}

export default EventLogButton;
