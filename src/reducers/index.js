import { combineReducers } from 'redux';
import auth from './auth';
import music from './music';

export default combineReducers({
  auth,
  music,
});
