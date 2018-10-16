import actionTypes from '../actions/actionTypes';
import DisplayState from '../data/displayState';


const display = (state = new DisplayState(), action) => {
  switch (action.type) {
    case actionTypes.CHANGE_DISPLAY_MODE:
      return state.set('mode', action.mode);

    case actionTypes.OPEN_LISENCE_DIALOG:
      return state.set('showLisence', true);

    case actionTypes.CLOSE_LISENCE_DIALOG:
      return state.set('showLisence', false);

    default:
      return state;
  }
};

export default display;
