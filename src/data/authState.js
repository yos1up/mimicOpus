import Immutable from 'immutable';


const AuthState = Immutable.Record({
  showSignIn: false,
  uid: '',
  uimage: '',
});

export default AuthState;
