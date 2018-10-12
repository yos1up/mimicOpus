import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  displayName: '',
  photoURL: '',
});

export default AuthState;
