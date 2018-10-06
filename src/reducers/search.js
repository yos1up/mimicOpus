import actionTypes from '../actions/actionTypes';
import SearchState from '../data/searchState';


const search = (state = new SearchState(), action) => {
  switch (action.type) {
    case actionTypes.SET_LOW_BPM:
      return state.set('lowBPM', action.bpm);

    case actionTypes.SET_HIGH_BPM:
      return state.set('highBPM', action.bpm);

    default:
      return state;
  }
};

export default search;
