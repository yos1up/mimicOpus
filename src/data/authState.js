import Immutable from 'immutable';

const AuthState = Immutable.Record({
  showSignIn: false,
  user: {}, // TODO: fix Proptype error
});

export default AuthState;
