import actionTypes from '../actions/actionTypes';
import DisplayState from '../data/displayState';


const display = (state = new DisplayState(), action) => {
  switch (action.type) {
    case actionTypes.CHANGE_DISPLAY_MODE:
      return state.set('mode', action.mode);

    default:
      return state;
  }
};

export default display;
