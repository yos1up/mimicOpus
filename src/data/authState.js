import Immutable from 'immutable';
import UserInfo from './userInfo';

const AuthState = Immutable.Record({
  showSignIn: false,
  userInfo: new UserInfo(),
});

export default AuthState;
