import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

@translate()
class LandingPage extends React.Component {

  static propTypes = {
    t: PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page landing-page">
        {this.props.t('LandingPage.welcome')}
      </div>
    );
  }
}

export default LandingPage;
