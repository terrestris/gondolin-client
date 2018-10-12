import React from 'react';
import PropTypes from 'prop-types';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { translate } from 'react-i18next';

import LoginPage from '../Page/LoginPage/LoginPage.jsx';
import LandingPage from '../Page/LandingPage/LandingPage.jsx';
import RegistrationPage from '../Page/RegistrationPage/RegistrationPage.jsx';

import {appConfig} from '../../config/app.config.js';

import ApplicationHeader from '../Heading/ApplicationHeader/ApplicationHeader.jsx';
import { setUser, toggleEventLog } from '../../actions/AppAction.js';
import { Authentication } from '../../util/Authentication';

import {
  SimpleButton,
  Window
} from '@terrestris/react-geo';
import EventLog from '../EventLog/EventLog.jsx';
import { EventLogger } from '../../util/EventLogger';

@connect(store => {
  return {
    language: store.app.language,
    eventLogVisible: store.app.eventLogVisible,
  };
})
@translate()
class Root extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    language: PropTypes.string,
    history: PropTypes.object,
    children: PropTypes.object,
    eventLogVisible: PropTypes.bool,
    t: PropTypes.func
  };

  constructor() {
    super();
    document.title = appConfig.header.title;
  }

  componentDidMount() {
    this.mounted = true;
    const env = process.env.NODE_ENV;
    const api = appConfig.api[env];
    const jwt = localStorage.getItem('gondolin_jwt');

    if (jwt) {
      Authentication.getUserByToken(jwt)
        .catch(err => {
          this.props.history.push('/login');
          EventLogger.log(`Get User By Token Failed: ${err}`, 'error', 'Authentication');
        })
        .then(user => {
          this.props.dispatch(setUser(user));
        });
    } else {
      this.props.history.push('/login');
    }
  }

  getEventLogPosition() {
    const logButton = document.getElementById('event-log-button');
    if (!logButton) {
      return [0,0];
    }
    const logButtonRect = logButton.getBoundingClientRect();
    const x = logButtonRect.x + logButtonRect.width - 300;
    const y = logButtonRect.y + logButtonRect.height;
    return [x, y];
  }

  render() {
    const {
      language,
      eventLogVisible,
      t
    } = this.props;

    return (
      <div className="container-fluid">
        <ApplicationHeader appLanguage={language} />
        <Route exact path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/registration" component={RegistrationPage} />
        {
          !eventLogVisible ? null :
            <Window
              className="event-log-window"
              title={t('EventLog.eventLog')}
              width={300}
              height={150}
              x={this.getEventLogPosition()[0] / 2}
              y={this.getEventLogPosition()[1] / 2}
              tools={[
                <SimpleButton
                  key="closeButton"
                  icon="close"
                  size="small"
                  tooltip="Close"
                  onClick={() => this.props.dispatch(toggleEventLog())}
                />
              ]}
            >
              <EventLog />
            </Window>
        }
      </div>
    );
  }
}

export default withRouter(Root);
