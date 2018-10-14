import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  username: '',
  photoURL: '',
  uid: '',
});

export default AuthState;
