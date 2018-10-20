import { combineReducers } from 'redux';
import auth from './auth';
import display from './display';
import music from './music';
import search from './search';
import ranking from './ranking';

export default combineReducers({
  auth,
  display,
  music,
  search,
  ranking,
});
