import Immutable from 'immutable';
import displayModes from './displayModes';


const DisplayState = Immutable.Record({
  mode: displayModes.HOME,
  showLicense: false,
  showFAQ: false,
});

export default DisplayState;
