import actionTypes from '../actions/actionTypes';
import SearchState from '../data/searchState';


const search = (state = new SearchState(), action) => {
  switch (action.type) {
    case actionTypes.SET_LOW_BPM:
      return state.set('lowBPM', action.bpm);

    case actionTypes.SET_HIGH_BPM:
      return state.set('highBPM', action.bpm);

    case actionTypes.SET_SEARCH_TITLE:
      return state.set('searchTitle', action.searchTitle);

    case actionTypes.SET_SEARCH_USER:
      return state.set('searchUser', action.searchUser);

    default:
      return state;
  }
};

export default search;
