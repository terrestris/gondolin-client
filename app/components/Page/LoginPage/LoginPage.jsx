import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import {withRouter} from 'react-router-dom';
import LoginForm from '../../Authentication/LoginForm/LoginForm.jsx';

@connect((store) => {
  return {app: store.app};
})
@translate()
class LoginPage extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    t: PropTypes.func,
    app: PropTypes.object
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  render() {
    return (
      <div className="page login-page">
        <section name="page-description">
          <h2 name="centered">
            {this.props.t('LoginPage.login')}
          </h2>
        </section>
        <LoginForm />
      </div>
    );
  }
}

export default withRouter(LoginPage);
