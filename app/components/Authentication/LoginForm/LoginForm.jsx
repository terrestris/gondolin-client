import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {SimpleButton} from '@terrestris/react-geo';
import websocket from '../../../websocket.js';
import {
  Form,
  Input
} from 'antd';

import './LoginForm.less';
import { setUser } from '../../../actions/AppAction.js';

import Authentication from '../../../util/Authentication';
import { EventLogger } from '../../../util/EventLogger.js';

@connect()
@translate()
class LoginForm extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    app: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: ''
    };
  }

  onLoginClicked = async () => {
    const {
      name,
      password
    } = this.state;
    const {
      t
    } = this.props;

    Authentication.login(name, password)
      .catch(err => {
        EventLogger.log(`${t('LoginForm.failed')}: ${err}`, 'error', 'Login');
      })
      .then(Authentication.getUserByToken)
      .catch(err => {
        EventLogger.log(`${t('LoginForm.tokenfailed')}: ${err}`, 'error', 'Login');
      })
      .then(user => {
        websocket.send(JSON.stringify({
          jwt: localStorage.getItem('gondolin_jwt'),
          message: 'connect'
        }));
        window.location.href = '/#/management';
        this.props.dispatch(setUser(user));
      });
  }

  render() {
    const {
      name,
      password
    } = this.state;

    const {
      t
    } = this.props;

    return (
      <Form className="login-form">
        <Form.Item
          label={t('LoginForm.name')}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder={t('LoginForm.username')}
            onChange={(e) => {
              const name = e.target.value;
              this.setState({name});
            }}
            value={name}
            name="name"
          />
        </Form.Item>
        <Form.Item
          label={t('LoginForm.password')}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
        >
          <Input
            placeholder={t('LoginForm.password')}
            type="password"
            onChange={(e) => {
              const password = e.target.value;
              this.setState({password});
            }}
            value={password}
            name="password"
          />
        </Form.Item>
        <SimpleButton
          type="primary"
          onClick={this.onLoginClicked}
          disabled={name.length === 0 || password.length === 0}
        >
          Login
        </SimpleButton>
      </Form>
    );
  }
}

export default LoginForm;
