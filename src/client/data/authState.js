import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  username: '',
  photoURL: '',
});

export default AuthState;
