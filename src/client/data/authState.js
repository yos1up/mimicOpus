import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  username: '',
  photoURL: '',
  provider: 'anonymous',
  uid: '',
  bInvalidUsername: false,
});

export default AuthState;
