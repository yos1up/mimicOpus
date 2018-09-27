import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './components/App';
import rootReducer from './reducers';

export default function () {
  const store = createStore(rootReducer);

  ReactDOM.render(
    <Provider store={store}>
      <App store={store} />
    </Provider>,
    document.getElementById('root'),
  );
}
