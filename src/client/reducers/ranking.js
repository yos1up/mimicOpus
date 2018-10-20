import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';
import RankingState from '../data/rankingState';


export default function (state = new RankingState(), action) {
  switch (action.type) {
    case actionTypes.ADD_RANKED_USER:
      return state.update('rankedUsers', ru => ru.set(action.rank, action.user));

    case actionTypes.CLEAR_RANKING_USERS:
      return state.set('rankedUsers', Immutable.Map());

    default:
      return state;
  }
}
