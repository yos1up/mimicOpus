import actionTypes from '../actions/actionTypes';
import AuthState from '../data/authState';


export default function (state = new AuthState(), action) {
  switch (action.type) {
    case actionTypes.OPEN_SIGN_IN_DIALOG:
      return state.set('showSignIn', true);

    case actionTypes.CLOSE_SIGN_IN_DIALOG:
      return state.set('showSignIn', false);

    case actionTypes.SET_USERNAME:
      return state.set('username', action.username);

    case actionTypes.SET_PHOTO_URL:
      return state.set('photoURL', action.photoURL);

    case actionTypes.SET_UID:
      return state.set('uid', action.uid);

    case actionTypes.SET_PROVIDER:
      return state.set('provider', action.provider);

    default:
      return state;
  }
}
