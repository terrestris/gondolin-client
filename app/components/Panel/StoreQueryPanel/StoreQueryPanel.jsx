import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';

import {
  Form,
  Input
} from 'antd';

import {
  SimpleButton,
  Titlebar
} from '@terrestris/react-geo';

import Api from '../../../util/Api.js';
import { EventLogger } from '../../../util/EventLogger.js';

@connect((store) => {
  return {
    app: store.app,
    measurements: store.measurements
  };
})
@translate()
class StoreQueryPanel extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    onCancel: PropTypes.func,
    onStore: PropTypes.func,
    app: PropTypes.object,
    measurements: PropTypes.object
  };

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    onStore: () => {},
    onCancel: () => {}
  }

  constructor(params) {
    super(params);

    this.state = {
      name: null
    };
  }

  cleanUpQuery = measurements => {
    let query = {...measurements};

    // remove useless informations
    delete query.allTraits;
    delete query.count;
    delete query.data;

    // remove unset informations
    if (!query.endDate) delete query.endDate;
    if (!query.startDate) delete query.startDate;
    if (!query.dateIntervalCount || query.dateIntervalType === 0) {
      delete query.dateIntervalCount;
      delete query.dateIntervalType;
    }

    return query;
  }

  /**
   * Creates a new stored query using the Api util.
   */
  storeQuery = () => {
    const {
      measurements,
      onStore,
      t
    } = this.props;

    const query = this.cleanUpQuery(measurements);

    Api.createEntities('StoredQuery', [{
      query,
      title: this.state.name
    }]).then(newQueries => {
      const message = t('StoreQueryPanel.querySaved', {title: this.state.name});
      EventLogger.log(message, 'success', 'Analysis');
      onStore(newQueries[0]);
    });

  }

  render() {
    const {
      name
    } = this.state;
    const {
      onCancel,
      t
    } = this.props;

    return (
      <div className="attribute-selection-panel">
        <Form>
          <Form.Item
            label={t('StoreQueryPanel.setQueryName')}
          >
            <Input
              type="text"
              placeholder={t('General.title')}
              onChange={event => this.setState({name: event.target.value})}
            />
          </Form.Item>
        </Form>
        <Titlebar
          style={{
            minHeight: '34px'
          }}
          tools={[
            <SimpleButton
              size="small"
              key="useSelectedBtn"
              disabled={!name}
              onClick={this.storeQuery}
            >
              {t('General.save')}
            </SimpleButton>,
            onCancel ?
              <SimpleButton
                size="small"
                key="cancelBtn"
                onClick={onCancel}
              >
                {t('General.cancel')}
              </SimpleButton> : null
          ]} />
      </div>
    );
  }
}

export default StoreQueryPanel;
