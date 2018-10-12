import { connect } from 'react-redux';

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {Link, withRouter} from 'react-router-dom';
import {
  SimpleButton
} from '@terrestris/react-geo';
import HeaderLogo from '../HeaderLogo/HeaderLogo.jsx';
import EventLogButton from '../../Button/EventLogButton/EventLogButton.jsx';
import {setUser} from '../../../actions/AppAction';

import './ApplicationHeader.less';
import { Authentication } from '../../../util/Authentication';

@connect((store) => {
  return {
    app: store.app,
    user: store.app.user
  };
})
@translate()
@withRouter
class ApplicationHeader extends React.Component{
  static propTypes= {
    dispatch: PropTypes.func,
    t: PropTypes.func,
    className: PropTypes.string,
    appLanguage: PropTypes.string.isRequired,
    app: PropTypes.object,
    history: PropTypes.object.isRequired,
    user: PropTypes.object
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static defaultProps = {
    appLanguage: 'de'
  }

  logout = () => {
    this.props.dispatch(setUser(undefined));
    this.props.history.push('/');
    Authentication.logout();
  }

  render() {
    const {
      user,
      t
    } = this.props;

    const loggedIn = !!user;
    const logIn = loggedIn ? null
      : <Link to="/login">
        <SimpleButton
          className="headerbutton"
          type="primary"
        >
          {t('ApplicationHeader.login')}
        </SimpleButton>
      </Link>;
    const register = loggedIn ? null
      : <Link to="/registration">
        <SimpleButton
          className="headerbutton"
          type="primary"
        >
          {t('ApplicationHeader.register')}
        </SimpleButton>
      </Link>;
    const logOut = loggedIn
      ? <SimpleButton
        className="headerbutton"
        type="primary"
        onClick={this.logout}
      >
        {t('ApplicationHeader.logout', {
          user: user.username
        })}
      </SimpleButton> :null;
    const map = loggedIn
      ? <Link to="/map">
        <SimpleButton
          className="headerbutton"
          type="primary"
        >{t('ApplicationHeader.map')}</SimpleButton>
      </Link>
      : null;
    const data = loggedIn
      ? <Link to="/analysis">
        <SimpleButton
          className="headerbutton"
          type="primary"
        >
          {t('ApplicationHeader.analysis')}
        </SimpleButton>
      </Link>
      : null;
    const management = loggedIn
      ? <Link to="/management">
        <SimpleButton
          className="headerbutton"
          type="primary"
        >
          {t('ApplicationHeader.management')}
        </SimpleButton>
      </Link>
      : null;

    return (
      <div className="application-header">
        <div className="left-items">
          <HeaderLogo/>
        </div>
        <div className="center-items">
          {management}
          {data}
          {map}
        </div>
        <div className="right-items">
          {logIn}
          {register}
          {logOut}
          <EventLogButton />
        </div>
      </div>
    );
  }
}

export default ApplicationHeader;
