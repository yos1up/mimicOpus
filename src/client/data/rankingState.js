import Immutable from 'immutable';

const RankingState = Immutable.Record({
  rankedUsers: Immutable.Map(),
});

export default RankingState;
