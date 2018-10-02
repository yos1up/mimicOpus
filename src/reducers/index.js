import { combineReducers } from 'redux';
import auth from './auth';
import display from './display';
import music from './music';

export default combineReducers({
  auth,
  display,
  music,
});
