import { connect } from 'react-redux';

import {
  loadRanking, changeDisplayMode,
} from '../actions';

import Ranking from '../components/Ranking';

const mapStateToProps = state => ({
  rankedUsers: state.ranking.rankedUsers,
});

const mapDispatchToProps = dispatch => ({
  loadRanking: (start, stop) => loadRanking(dispatch, start, stop),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ranking);
