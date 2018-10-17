import Immutable from 'immutable';


const SearchState = Immutable.Record({
  lowBPM: 60,
  highBPM: 200,
  searchTitle: '',
  searchUser: '',
  countQuestions: 0,
});

export default SearchState;
