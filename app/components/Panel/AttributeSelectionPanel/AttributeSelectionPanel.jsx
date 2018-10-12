import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';

import {
  Select,
  Form
} from 'antd';
const Option = Select.Option;

import {
  SimpleButton,
  Titlebar
} from '@terrestris/react-geo';

@translate()
class AttributeSelectionPanel extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    attributes: PropTypes.array,
    onCancel: PropTypes.func,
    onAddToChart: PropTypes.func
  };

  /**
   * The defaultProps.
   * @type {Object}
   */
  static defaultProps = {
    onCancel: ()=>{}
  }

  constructor(params) {
    super(params);
    let timestampField = null;
    let valueField = null;

    if (params.attributes.find(val => val.field === 'timestamp')) {
      timestampField = 'timestamp';
    }
    if (params.attributes.find(val => val.field === 'value')) {
      valueField = 'value';
    }

    this.state = {
      timestampField: timestampField,
      valueField: valueField
    };
  }

  valueFieldSelected = valueField => this.setState({valueField})

  timestampFieldSelected = timestampField => this.setState({timestampField})

  /**
   * Maps attributes to <Option> elements.
   * @return {Option[]} an array of <Option>s
   */
  getAttributeOptionList() {
    return this.props.attributes.map(attribute => {
      return <Option
        key={attribute.field}
        value={attribute.field}>
        {attribute.headerName}
      </Option>;
    });
  }

  render() {
    const {
      timestampField,
      valueField
    } = this.state;
    const {
      onCancel,
      t
    } = this.props;

    return (
      <div className="attribute-selection-panel">
        <Form>
          <Form.Item
            label={t('AttributeSelectionPanel.selectTimestampField')}
          >
            <Select
              defaultValue={timestampField}
              onChange={this.timestampFieldSelected}
            >
              {this.getAttributeOptionList()}
            </Select>
          </Form.Item>
          <Form.Item
            label={t('AttributeSelectionPanel.selectValueField')}
          >
            <Select
              defaultValue={valueField}
              onChange={this.valueFieldSelected}
            >
              {this.getAttributeOptionList()}
            </Select>
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
              disabled={!(timestampField && valueField)}
              onClick={() => {
                this.props.onAddToChart(
                  timestampField,
                  valueField,
                  this.props.attributes.find(a => a.field === valueField));
              }}
            >
              {t('AttributeSelectionPanel.addToChart')}
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

export default AttributeSelectionPanel;
