import React from 'react';
import PropTypes from 'prop-types';

export function TableHeader(props) {
  return (
    <tr>
      <th>{props.propColumnName}</th>
      <th>{props.valColumnName}</th>
    </tr>
  );
}

TableHeader.propTypes = {
  propColumnName: PropTypes.string,
  valColumnName: PropTypes.string
};

TableHeader.defaultProps = {
  propColumnName: 'Attribut',
  valColumnName: 'Wert'
};

export default TableHeader;
