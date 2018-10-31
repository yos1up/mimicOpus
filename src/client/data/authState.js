import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  displayName: '',
  userName: '',
  photoURL: '',
  provider: 'anonymous',
  uid: '',
});

export default AuthState;
