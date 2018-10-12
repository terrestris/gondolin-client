import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import {SimpleButton} from '@terrestris/react-geo';
import {
  Form,
  Icon,
  Input,
  InputNumber
} from 'antd';

import './RegistrationForm.less';

import Authentication from '../../../util/Authentication';
import { EventLogger } from '../../../util/EventLogger';

@connect()
@translate()
@withRouter
class RegistrationForm extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    app: PropTypes.object,
    history: PropTypes.object,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      passwordConfirm: null,
      firstname: null,
      lastname: null,
      title: null,
      street: null,
      housenumber: null,
      zip: null,
      city: null,
      phone: null,
      mobile: null,
      email: null,
      fax: null
    };
  }

  onRegistrationClicked = async () => {
    const {
      passwordConfirm,
      ...userData
    } = this.state;
    const {
      history,
      t
    } = this.props;

    Authentication.register(userData)
      .catch(err => {
        EventLogger.log(`${t('RegistrationForm.failed')}: ${err}`, 'error', 'Registration');
      })
      .then(user => {
        const message = t('RegistrationForm.success', {
          user: user.username
        });
        EventLogger.log(message, 'success', 'Registration');
        history.push('login');
      });
  }

  changeHandler = (key, value) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  render() {
    const {
      username,
      password,
      passwordConfirm,
      firstname,
      lastname,
      title,
      street,
      housenumber,
      zip,
      city,
      phone,
      mobile,
      email,
      fax
    } = this.state;
    const {
      t
    } = this.props;

    const formisValid = true; // TODO validate

    return (
      <Form className="registration-form" layout="vertical">
        <div className="form-row">
          <Form.Item
            label={t('RegistrationForm.title')}
          >
            <Input
              autoComplete="honorific-suffix"
              onChange={event => this.changeHandler('title', event.target.value)}
              value={title}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.givenname')}
            required
            validateStatus={firstname ? 'success' : 'error'}
          >
            <Input
              autoComplete="given-name"
              onChange={event => this.changeHandler('firstname', event.target.value)}
              value={firstname}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.familyname')}
            required
            validateStatus={lastname ? 'success' : 'error'}
          >
            <Input
              autoComplete="family-name"
              onChange={event => this.changeHandler('lastname', event.target.value)}
              value={lastname}
            />
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item
            label={t('RegistrationForm.username')}
            required
            validateStatus={username ? 'success' : 'error'}
          >
            <Input
              autoComplete="username"
              onChange={event => this.changeHandler('username', event.target.value)}
              value={username}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.email')}
            required
            validateStatus={email ? 'success' : 'error'}
          >
            <Input
              type="email"
              autoComplete="email"
              onChange={event => this.changeHandler('email', event.target.value)}
              value={email}
            />
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item
            label={t('RegistrationForm.password')}
            required
            hasFeedback
            validateStatus={password ? 'success' : 'error'}
          >
            <Input
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={event => this.changeHandler('password', event.target.value)}
              value={password}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.confirmpassword')}
            hasFeedback
            validateStatus={passwordConfirm && password === passwordConfirm ? 'success' : 'error'}
            required
          >
            <Input
              type="password"
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              onChange={event => this.changeHandler('passwordConfirm', event.target.value)}
              value={passwordConfirm}
            />
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item
            label={t('RegistrationForm.mobile')}
          >
            <Input
              type="tel"
              onChange={event => this.changeHandler('mobile', event.target.value)}
              value={mobile}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.landline')}
          >
            <Input
              type="tel"
              onChange={event => this.changeHandler('phone', event.target.value)}
              value={phone}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.fax')}
          >
            <Input
              onChange={event => this.changeHandler('fax', event.target.value)}
              value={fax}
            />
          </Form.Item>
        </div>
        <div className="form-row">
          <Form.Item
            label={t('RegistrationForm.street')}
          >
            <Input
              autoComplete="street-address"
              onChange={event => this.changeHandler('street', event.target.value)}
              value={street}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.housenumber')}
          >
            <InputNumber
              onChange={value => this.changeHandler('housenumber', value)}
              value={housenumber}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.zipcode')}
          >
            <InputNumber
              autoComplete="postal-code"
              onChange={value => this.changeHandler('zip', value)}
              value={zip}
            />
          </Form.Item>
          <Form.Item
            label={t('RegistrationForm.city')}
          >
            <Input
              autoComplete="address-level2"
              onChange={event => this.changeHandler('city', event.target.value)}
              value={city}
            />
          </Form.Item>
        </div>
        <SimpleButton
          type="primary"
          onClick={this.onRegistrationClicked}
          disabled={!formisValid}
        >
          {t('RegistrationForm.register')}
        </SimpleButton>
      </Form>
    );
  }
}

export default RegistrationForm;
