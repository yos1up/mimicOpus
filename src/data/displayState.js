import Immutable from 'immutable';
import displayModes from './displayModes';


class DisplayState extends Immutable.Record({
  mode: displayModes.MAKE_QUESTION,
}) {
}

export default DisplayState;
