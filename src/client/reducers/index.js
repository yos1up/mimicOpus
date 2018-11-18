import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import auth from './auth';
import display from './display';
import music from './music';
import search from './search';
import ranking from './ranking';


export default history => combineReducers({
  router: connectRouter(history),
  auth,
  display,
  music,
  search,
  ranking,
});
