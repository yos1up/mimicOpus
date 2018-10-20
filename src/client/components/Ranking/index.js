import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


class Ranking extends React.Component {
  componentDidMount() {
    const { loadRanking } = this.props;
    loadRanking();
  }

  render() {
    const { rankedUsers } = this.props;
    return (
      <div id="Ranking">
        <Table
          style={{
            position: 'absolute',
            top: 10,
            left: 0,
            width: 1000,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>順位</TableCell>
              <TableCell>ユーザー</TableCell>
              <TableCell>レーティング</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.entries(rankedUsers.toJS()).map((item) => {
                const [k, v] = item;
                return (
                  <TableRow
                    key={k}
                  >
                    <TableCell>{k}</TableCell>
                    <TableCell>{v.username}</TableCell>
                    <TableCell>{v.rating}</TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

Ranking.propTypes = {
  rankedUsers: PropTypes.instanceOf(Immutable.Map).isRequired,
  loadRanking: PropTypes.func.isRequired,
};

export default Ranking;
