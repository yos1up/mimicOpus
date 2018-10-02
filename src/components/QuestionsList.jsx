import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


function QuestionsList({ questionsList }) {
  console.log(questionsList);
  return (
    <div id="QuestionsList" style={{ position: 'absolute', top: 400 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Melodies</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questionsList.map((item, idx) => (
            <TableRow key={idx} hover>
              <TableCell component="th" scope="row">
                melody
                {idx}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default QuestionsList;
