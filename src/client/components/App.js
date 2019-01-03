import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import DesktopApp from './Desktop/App';
import MobileApp from './Mobile/App';

import EmbedPianoRoll from './embed/PianoRoll';

import device from '../data/device';

import { history } from '../configureStore';

import theme from './theme';

import Tracker from './Tracker';


class App extends React.Component {
  componentDidMount() {
    const { loadMe } = this.props;
    loadMe();
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <ConnectedRouter history={history}>
          <div>
            <Switch>
              <Route path="/embed/pianoroll" component={EmbedPianoRoll} />
              <Route>
                {device.isMobile() ? (
                  <MobileApp />
                ) : (
                  <DesktopApp />
                )}
              </Route>
            </Switch>
          </div>
        </ConnectedRouter>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  loadMe: PropTypes.func.isRequired,
};

export default App;
