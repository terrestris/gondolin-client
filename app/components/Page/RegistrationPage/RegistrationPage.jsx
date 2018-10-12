import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import RegistrationForm from '../../Authentication/RegistrationForm/RegistrationForm.jsx';

@connect((store) => {
  return {app: store.app};
})
@translate()
class RegistrationPage extends React.Component {

  static propTypes = {
    dispatch: PropTypes.func,
    t: PropTypes.func,
    app: PropTypes.object
  };

  render() {
    return (
      <div className="page registration-page">
        <section name="page-description">
          <h2 name="centered">
            {this.props.t('RegistrationPage.registration')}
          </h2>
        </section>
        <RegistrationForm />
      </div>
    );
  }
}

export default RegistrationPage;
