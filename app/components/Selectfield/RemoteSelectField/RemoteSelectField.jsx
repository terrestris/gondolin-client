import React from 'react';
import PropTypes from 'prop-types';
import {translate} from 'react-i18next';
import _isString from 'lodash/isString';
import _get from 'lodash/get';
import {
  Select,
  Spin
} from 'antd';
import { SimpleButton } from '@terrestris/react-geo';
const Option = Select.Option;

@translate()
export class RemoteSelectField extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    url: PropTypes.string,
    sortKey: PropTypes.string,
    /**
     * Function that should return a string or an Element. If an Element is
     * returned, a property named 'filterField' is required to be able to filter
     * the data entries. The filterField can be one of the tuples attributes.
     */
    renderFunction: PropTypes.func,
    onChange: PropTypes.func,
    // The "value" prop of the RemoteSelectField should receive IDs only
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number)
    ]),
    filterFunction: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
    label: PropTypes.string
  };

  static defaultProps ={
    filterFunction: (a) => a
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: [],
      fetching: false
    };
    this.lastFetchId = 0;
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const {
      data
    } = this.state;
    let value = this.props.value;

    if (value && value !== prevProps.value && data) {
      value = Array.isArray(value) ? value : [value];
      value = data.filter(tuple => value.includes(tuple.id));
      this.setState({
        value
      });
    }
  }

  /**
   * Fetch the data from the given url and sets the result as data. If a value
   * prop is passed the value will be set after the data was fetched.
   */
  fetchData = () => {
    const {
      url,
      value
    } = this.props;
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ fetching: true });
    fetch(url)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) { // for fetch callback order
          return;
        }
        const data = Array.isArray(body) ? body : body.data;

        const {
          sortKey
        } = this.props;

        if (this.props.sortKey) {
          data.sort((a,b) => {
            var comp1 = a[sortKey];
            var comp2 = b[sortKey];
            if (comp1 && comp2 && comp1 < comp2) {
              return -1;
            }
            if (comp1 && comp2 && comp1 === comp2) {
              return 0;
            }
            return 1;
          });
        }

        let newValue = value;
        if (newValue) {
          newValue = Array.isArray(newValue) ? newValue : [newValue];
          newValue = data.filter(tuple => newValue.includes(tuple.id));
          this.setState({
            value: newValue
          });
        }

        this.setState({
          data,
          fetching: false
        });
      });
  }

  /**
   * Get the option text for a given tuple.
   *
   * @param {Object} tuple The data tuple.
   * @return {String|*} The text or children that should be rendererd as option.
   */
  getOptionChildren = tuple => {
    if (this.props.renderFunction) {
      return this.props.renderFunction(tuple);
    } else {
      return tuple.text;
    }
  }

  /**
   * Sets the selected value (key) to the state and calls the callback function
   * with the matching data tuple.
   *
   * If the RemoteSelectField is configure with mode="multiple" the callback
   * method is called with an array of values. Otherwise just with the selected
   * value.
   *
   * @param {*} value The selected value or values.
   */
  handleChange = value => {
    const {
      onChange,
      mode
    } = this.props;

    let selected = null;
    if (value) {
      selected = this.state.data.filter(t => {
        if (Array.isArray(value)) {
          return value.map(v => parseInt(v.key, 10)).includes(t.id);
        } else {
          return t.id === parseInt(value.key, 10);
        }
      });
      this.setState({
        value: selected,
        fetching: false
      });
    }

    if (onChange) {
      onChange(mode === 'multiple' ? selected : selected[0]);
    }
  }

  /**
   * Callback function for the select all button.
   *
   * Selects all possible values.
   */
  onSelectAllClick = () => {
    const data = this.state.data;
    const value = data.filter(this.props.filterFunction);
    this.setState({
      value
    });
    this.props.onChange(value);
  }

  /**
   * Filter the options by the current typed text of the input field.
   *
   * @param {String} inputValue The typed text.
   * @param {Option} option The option.
   */
  filterOption = (inputValue, option) => {
    const data = this.state.data;
    const optionChild = option.props.children;
    let textToFilter;

    if (!_isString(optionChild)) {
      const filterField = _get(optionChild, 'props.filterField');
      if (filterField) {
        const optionId = parseInt(option.key, 10);
        const tuple = data.filter(t => t.id === optionId)[0];
        const filterFieldValue = tuple[filterField];
        if (!_isString(filterFieldValue)) {
          return true;
        }
        textToFilter = filterFieldValue.toLowerCase();
      } else {
        return true;
      }
    } else {
      textToFilter = optionChild.toLowerCase();
    }

    return textToFilter.includes(inputValue.toLowerCase());
  }

  render() {
    const {
      value: propValue, // eslint-disable-line no-unused-vars
      className,
      style,
      filterFunction,
      label,
      onChange,
      t,
      ...passThroughProps
    } = this.props;

    const {
      fetching,
      data,
      value
    } = this.state;

    const options = data
      .filter(filterFunction)
      .map(tuple => {
        const text = this.getOptionChildren(tuple);
        const option = <Option key={tuple.id}>{text}</Option>;
        return option;
      });

    const selected = value.map(tuple => {
      return {
        key: tuple.id.toString(),
        label: this.getOptionChildren(tuple)
      };
    });

    return (
      <span
        className={className}
        style={style}
      >
        <div className="remote-selectfield-label">{label}</div>
        <Select
          autoFocus
          showSearch
          labelInValue
          value={selected}
          notFoundContent={fetching ? <Spin size="small" /> : 'Keine Daten gefunden.'}
          filterOption={this.filterOption}
          onSearch={this.fetchData}
          onChange={this.handleChange}
          {...passThroughProps}
        >
          {options}
        </Select>
        {
          passThroughProps.mode === 'multiple' ?
            <SimpleButton
              icon="check-square-o"
              tooltip={t('RemoteSelectField.selectAll')}
              onClick={this.onSelectAllClick}
            /> : null
        }
      </span>
    );
  }
}

export default RemoteSelectField;
