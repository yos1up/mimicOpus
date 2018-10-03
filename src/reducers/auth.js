import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';

const AuthState = Immutable.Record({
  showSignIn: false,
  uid: '',
  uimage: '',
});

export default function (state = new AuthState(), action) {
  switch (action.type) {
    case actionTypes.OPEN_SIGN_IN_DIALOG:
      return state.set('showSignIn', true);

    case actionTypes.CLOSE_SIGN_IN_DIALOG:
      return state.set('showSignIn', false);

    case actionTypes.SET_UID:
      return state.set('uid', action.uid);

    case actionTypes.SET_UIMAGE:
      return state.set('uimage', action.uimage);

    default:
      return state;
  }
}
