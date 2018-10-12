import React from 'react';
import PropTypes from 'prop-types';
import { StringUtils } from '../../util/StringUtils';

export function TableRow(props) {
  let key = props.columns[0];
  let val = StringUtils.urlify(props.columns[1], 'Weitere Infos...');

  let rowStyle = {
    display: props.showKeys ? 'visible' : 'none'
  };

  return (
    <tr>
      <td style={rowStyle}>{key}</td>
      <td dangerouslySetInnerHTML={{__html: val}}></td>
    </tr>
  );
}

TableRow.propTypes = {
  showKeys: PropTypes.bool,
  columns: PropTypes.array.isRequired
};

export default TableRow;
