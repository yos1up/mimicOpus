import Immutable from 'immutable';


const SearchState = Immutable.Record({
  lowBPM: 60,
  highBPM: 200,
});

export default SearchState;
