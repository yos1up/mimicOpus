import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Helmet } from 'react-helmet';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import displayModes from '../../data/displayModes';


class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  componentDidMount() {
    const { loadRanking, changeDisplayMode } = this.props;
    const { page } = this.state;
    loadRanking(10 * page + 1, 10 * (page + 1));
    changeDisplayMode(displayModes.RANKING);
  }

  render() {
    const { rankedUsers, loadRanking } = this.props;
    const { page } = this.state;
    return (
      <div id="Ranking">
        <Helmet>
          <meta charSet="utf-8" />
          <title>ランキング - mimicOpus</title>
        </Helmet>
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
                    <TableCell>{v.displayName}</TableCell>
                    <TableCell>{(v.rating !== undefined && v.rating !== null) ? parseFloat(v.rating).toFixed() : ''}</TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
          <TableFooter>
            <TablePagination
              colSpan={3}
              count={100}
              rowsPerPage={10}
              page={page}
              rowsPerPageOptions={[10]}
              onChangePage={(event, page_) => {
                this.setState({ page: page_ });
                loadRanking(10 * page_ + 1, 10 * (page_ + 1));
              }}
            />
          </TableFooter>
        </Table>
      </div>
    );
  }
}

Ranking.propTypes = {
  rankedUsers: PropTypes.instanceOf(Immutable.Map).isRequired,
  loadRanking: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default Ranking;
