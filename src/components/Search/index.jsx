import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function Search(props) {
  const { questionsList } = props;
  return (
    <div id="Search">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Melodies</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {// TODO do not use array index
            questionsList.map((item, idx) => (
              <TableRow key={idx} hover>
                <TableCell component="th" scope="row">
                  melody
                  {idx}
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

Search.propTypes = {
  questionsList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default Search;
