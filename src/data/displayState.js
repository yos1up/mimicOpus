import Immutable from 'immutable';
import displayModes from './displayModes';


const DisplayState = Immutable.Record({
  mode: displayModes.SEARCH,
});

export default DisplayState;
