import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router'

import { history, store } from './configureStore';
import App from './containers/App';
import rootReducer from './reducers';


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route exact path="/" render={() => (<div>Home</div>)} />
          <Route path="/test" render={() => (<div>Test</div>)} />
          <Route path="/test/" render={() => (<div>Test</div>)} />
          <Route path="/app" render={() => (<div>Test</div>)} />
          <Route render={() => (<div>Miss</div>)} />
        </Switch>
        <App store={store} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);
