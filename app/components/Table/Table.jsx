import React from 'react';
import PropTypes from 'prop-types';

import TableRow from './TableRow.jsx';
import TableHeader from './TableHeader.jsx';

export function Table(props) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover" style={{marginBottom: 0}}>
        <thead style={{display: props.showHeader ? 'visible' : 'none'}}>
          <TableHeader/>
        </thead>
        <tbody>
          {
            Object.keys(props.rows).map((objKey, i) => {
              if (props.filter.includes(objKey)) {
                return <TableRow
                  key={i}
                  showKeys={props.showKeys}
                  columns={[objKey, props.rows[objKey]]}
                />;
              }
            })
          }
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  showHeader: PropTypes.bool,
  showKeys: PropTypes.bool,
  filter: PropTypes.array,
  rows: PropTypes.object
};

Table.defaultProps = {
  showHeader: false,
  showKeys: false,
  filter: []
};

export default Table;
