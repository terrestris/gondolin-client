import React from 'react';
import PropTypes from 'prop-types';

import { appConfig } from '../../../config/app.config';
import associatedModelDisplayFields from '../../../config/pKeyAssociations.json';

const env = process.env.NODE_ENV;
const apiUrl = appConfig.api[env];

import { Select } from 'antd';
const Option = Select.Option;

import './FloatingSelectCellEditor.less';
import { RemoteSelectField } from '../../Selectfield/RemoteSelectField/RemoteSelectField.jsx';

class FloatingSelectCellEditor extends React.Component {

  static propTypes = {
    attribute: PropTypes.object,
    grid: PropTypes.object,
    node: PropTypes.object,
    api: PropTypes.object,
    column: PropTypes.object,
    value: PropTypes.any,
    values: PropTypes.arrayOf(PropTypes.any)
  };

  constructor(props) {
    super(props);
    const {
      node,
      attribute
    } = props;

    const isAssociationCol = attribute && !attribute._modelAttribute;
    let modelName;
    if (isAssociationCol) {
      modelName = attribute.options.name.singular;
    }

    this.state = {
      isFloating: !!node.floating,
      value: props.value,
      isAssociationCol: isAssociationCol,
      associatedModel: modelName,
      associatedModelDisplayField: associatedModelDisplayFields[modelName]
    };
  }

  onHeaderDropDownValueChange = newValue => {
    this.setState({
      value: newValue
    });
    // Focuses the first cell in the edited column
    window.setTimeout(() => {
      this.props.api.setFocusedCell(0, this.props.column.colId, true);
    }, 0);
  }

  onEntityDropDownValueChange = selection => {
    const value = Array.isArray(selection)
      ? selection.map(val => val.id)
      : selection.id;

    this.setState({value}, () => {
      if (!this.props.attribute.isMultiAssociation) {
        this.props.api.stopEditing();
      }
    });

  }

  onTextFieldChangeListener = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  // called by ag-Grid, to get the final value
  getValue = () => {
    return this.state.value;
  }

  // cannot use componentDidMount because although the component might be ready from React's point of
  // view, it may not yet be in the browser (put in by ag-Grid) so focus will not work
  afterGuiAttached = () => {
    this.setState({
      value: this.props.value
    });

    // get ref from React component
    var eInput = this.inputField;

    if (!this.state.isFloating) {
      if (this.state.value) {
        eInput.value = this.state.value;
      }
      if (this.highlightAllOnFocus) {
        eInput.select();
      } else {
        // when we started editing, we want the carot at the end, not the start.
        // this comes into play in two scenarios: a) when user hits F2 and b)
        // when user hits a printable character, then on IE (and only IE) the caret
        // was placed after the first character, thus 'apply' would end up as 'pplea'
        if(eInput.focus) {
          eInput.focus();
        }
      }
    }
  }

  // if we want the editor to appear in a popup, then return true.
  isPopup() {
    return false;
  }

  // return true here if you don't want to allow editing on the cell.
  isCancelBeforeStart() {
    return false;
  }

  getMenuOptions = () => {
    return this.props.values.map((entry) => {
      const value = (typeof entry === 'string' || entry instanceof String) ? entry : entry.value;
      return (
        <Option
          key={value}
          value={value}
        >
          {entry}
        </Option>
      );
    });
  }

  onBlur = () => {
    this.props.api.stopEditing();
  }

  render() {
    const {
      attribute,
      node
    } = this.props;

    const {
      associatedModel,
      value,
      associatedModelDisplayField
    } = this.state;

    if (node.rowPinned) {
      return (
        <Select
          className="floating-select-celleditor"
          openImmediately={true}
          ref={field => this.inputField = field}
          value={value}
          onChange={this.onHeaderDropDownValueChange}
        >
          {this.getMenuOptions()}
        </Select>
      );
    } else {
      if(this.state.isAssociationCol){
        const mode = attribute.isMultiAssociation ? 'multiple' : 'default';
        return <RemoteSelectField
          className="floating-select-celleditor"
          mode={mode}
          value={value}
          ref={field => this.inputField = field}
          url={`${apiUrl}/${associatedModel}/get`}
          renderFunction={tuple => {
            return tuple[associatedModelDisplayField];
          }}
          sortKey={associatedModelDisplayField}
          onChange={this.onEntityDropDownValueChange}
        />;
      } else {
        return (
          <input
            className="floating-select-celleditor"
            ref={field => this.inputField = field}
            onChange={this.onTextFieldChangeListener}
            onBlur={this.onBlur}
          />
        );
      }
    }
  }
}

export default FloatingSelectCellEditor;
