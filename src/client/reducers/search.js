import actionTypes from '../actions/actionTypes';
import SearchState from '../data/searchState';


const search = (state = new SearchState(), action) => {
  switch (action.type) {
    case actionTypes.SET_COUNT_QUESTIONS:
      return state.set('countQuestions', action.count);

    default:
      return state;
  }
};

export default search;
