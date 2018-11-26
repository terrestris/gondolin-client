import React from 'react';
import PropTypes from 'prop-types';
import { InputNumber } from 'antd';

class NumericEditor extends React.Component {

    static propTypes = {
      type: PropTypes.string,
      grid: PropTypes.object,
      node: PropTypes.object,
      api: PropTypes.object,
      column: PropTypes.object,
      value: PropTypes.any,
      trait: PropTypes.object
    };

    constructor(props) {
      super(props);
      this.state = {
        value: props.value
      };
    }

    onChange = (value) => {
      this.setState({
        value
      });
    }

    // called by ag-Grid, to get the final value
    getValue() {
      return this.state.value;
    }

    // cannot use componentDidMount because although the component might be ready from React's point of
    // view, it may not yet be in the browser (put in by ag-Grid) so focus will not work
    afterGuiAttached() {
      this.setState({
        value: this.props.value
      });
    }

    // if we want the editor to appear in a popup, then return true.
    isPopup() {
      return false;
    }

    // return true here if you don't want to allow editing on the cell.
    isCancelBeforeStart() {
      return false;
    }

    onBlur(){
      this.props.api.stopEditing();
    }

    formatter = (value) => {
      const unit = this.props.trait.unit;
      if (unit) {
        return `${value} ${unit}`;
      }
    }

    parser = (value) => {
      const unit = this.props.trait.unit;
      return value.replace(` ${unit}`, '');
    }

    render() {
      return (
        <InputNumber
          style={{
            width: '100%'
          }}
          formatter={this.formatter}
          parser={this.parser}
          value={this.state.value}
          onChange={this.onChange}
        />
      );
    }
}

export default NumericEditor;
