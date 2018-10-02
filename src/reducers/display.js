import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';

export const displayModes = {
  MAKE_QUESTION: 'MAKE_QUESTION',
  PLAY_QUESTION: 'PLAY_QUESTION',
  SEARCH: 'SEARCH',
  USER: 'USER',
};

class DisplayState extends Immutable.Record({
  mode: displayModes.MAKE_QUESTION,
}) {
}

const display = (state = new DisplayState(), action) => {
  switch (action.type) {
    case actionTypes.CHANGE_DISPLAY_MODE:
      return state.set('mode', action.mode);

    default:
      return state;
  }
};

export default display;
