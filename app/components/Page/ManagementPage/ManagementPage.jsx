import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Select } from 'antd';
import ManagementGrid from '../../Grid/ManagementGrid/ManagementGrid.jsx';
const { Option, OptGroup } = Select;

import './ManagementPage.less';

@translate()
class ManagementPage extends React.Component {
  static propTypes = {
    t: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      model: null
    };
  }

  onEntityChange = (model) => {
    this.setState({model});
  }

  render() {
    const {t} = this.props;
    const {
      model
    } = this.state;

    return (
      <div className="page management-page">
        <h2>{t('ManagementPage.management')}</h2>
        <Select className="entity-select-field" onChange={this.onEntityChange} >
          <OptGroup label={t('ManagementPage.structuralData')}>
            <Option value="Application">{t('Entities.application')}</Option>
            <Option value="Layer">{t('Entities.layer')}</Option>
            <Option value="User">{t('Entities.user')}</Option>
            <Option value="UserGroup">{t('Entities.usergroup')}</Option>
          </OptGroup>
        </Select>
        {
          model ?
            <ManagementGrid
              modelName={model}
              autoLoad={true}
            />
            : null
        }
      </div>
    );
  }
}

export default ManagementPage;
