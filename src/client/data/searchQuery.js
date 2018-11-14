import Immutable from 'immutable';

import filterLevels from './filterLevels';

const SearchQuery = Immutable.Record({
  lowBPM: 60,
  highBPM: 200,
  title: '',
  user: '',
  madeByMe: true,
  answered: true,
  unanswered: true,
  level: filterLevels.TO_TWO_HND,
  showNoLevel: true,
});

export default SearchQuery;
