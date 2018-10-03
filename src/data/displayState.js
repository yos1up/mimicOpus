import Immutable from 'immutable';
import displayModes from './displayModes';


const DisplayState = Immutable.Record({
  mode: displayModes.MAKE_QUESTION,
});

export default DisplayState;
