import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import moment from 'moment';
moment.locale('de-de');

class DateEditor extends React.Component {

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
      value: props.value,
      endOpen: false
    };
  }

  onChange = (date, dateString) => {
    this.setState({
      value: dateString
    });
  }

  handleEndOpenChange = (open) => {
    this.setState({
      endOpen: open
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
    return true;
  }

  // return true here if you don't want to allow editing on the cell.
  isCancelBeforeStart() {
    return false;
  }

  onBlur(){
    this.props.api.stopEditing();
  }

  render() {
    return (
      <DatePicker
        onChange={this.onChange.bind(this)}
        open={this.state.endOpen}
        onOpenChange={this.handleEndOpenChange}
        format="YYYY-MM-DD"
      />
    );
  }
}

export default DateEditor;
