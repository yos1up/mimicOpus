import { connect } from 'react-redux';

import {
  loadRanking,
} from '../../actions';

import Ranking from '../../components/Ranking';

const mapStateToProps = state => ({
  rankedUsers: state.ranking.rankedUsers,
});

const mapDispatchToProps = dispatch => ({
  loadRanking: (start, stop) => loadRanking(dispatch, start, stop),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ranking);
