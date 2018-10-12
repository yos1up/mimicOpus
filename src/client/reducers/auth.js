import actionTypes from '../actions/actionTypes';
import AuthState from '../data/authState';


export default function (state = new AuthState(), action) {
  switch (action.type) {
    case actionTypes.OPEN_SIGN_IN_DIALOG:
      return state.set('showSignIn', true);

    case actionTypes.CLOSE_SIGN_IN_DIALOG:
      return state.set('showSignIn', false);

    case actionTypes.SET_USER:
      return state
        .set('displayName', action.user.displayName)
        .set('photoURL', action.user.photoURL);

    default:
      return state;
  }
}
