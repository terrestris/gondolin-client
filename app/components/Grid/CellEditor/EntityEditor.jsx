import React from 'react';
import PropTypes from 'prop-types';
import {appConfig} from '../../../config/app.config.js';

import RemoteSelectField from '../../Selectfield/RemoteSelectField/RemoteSelectField.jsx';

class EntityEditor extends React.Component {

    static propTypes = {
      placeholder: PropTypes.string,
      keyprop: PropTypes.string,
      type: PropTypes.string,
      api: PropTypes.object,
      value: PropTypes.any,
      filterFunction: PropTypes.func
    };

    constructor(props) {
      super(props);
      this.state = {
        value: null
      };
    }

    onEntityDrowpDownValueChange = selection => {
      this.setState({
        value: selection.key || selection.id
      }, () => {
        this.props.api.stopEditing();
      });
    }

    onTextFieldChangeListener(event) {
      this.setState({
        value: event.target.value
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

    render() {
      const {
        type,
        placeholder,
        keyprop,
        filterFunction
      } = this.props;
      const env = process.env.NODE_ENV;
      const api = appConfig.api[env];

      return (
        <RemoteSelectField
          className="entity-editor"
          url={`${api}/${type}/get`}
          placeholder={placeholder}
          filterFunction={filterFunction}
          renderFunction={tuple => tuple[keyprop]}
          sortKey={keyprop}
          onSelect={this.onEntityDrowpDownValueChange}
        />
      );
    }
}

export default EntityEditor;
