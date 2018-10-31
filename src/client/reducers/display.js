import actionTypes from '../actions/actionTypes';
import DisplayState from '../data/displayState';


const display = (state = new DisplayState(), action) => {
  switch (action.type) {
    case actionTypes.CHANGE_DISPLAY_MODE:
      return state.set('mode', action.mode);

    case actionTypes.OPEN_LICENSE_DIALOG:
      return state.set('showLicense', true);

    case actionTypes.CLOSE_LICENSE_DIALOG:
      return state.set('showLicense', false);

    case actionTypes.OPEN_FAQ_DIALOG:
      return state.set('showFAQ', true);

    case actionTypes.CLOSE_FAQ_DIALOG:
      return state.set('showFAQ', false);

    default:
      return state;
  }
};

export default display;
