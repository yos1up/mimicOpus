import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';

import SignIn from '../containers/SignIn';
import License from '../containers/License';
import Header from '../containers/Header';

import Home from '../containers/Home';
import EditQuestion from '../containers/EditQuestion';
import MakeQuestion from '../containers/MakeQuestion';
import PlayQuestion from '../containers/PlayQuestion';
import Search from '../containers/Search';
import Profile from '../containers/Profile';
import Ranking from '../containers/Ranking';

import displayModes from '../data/displayModes';

import theme from './theme';


class App extends React.Component {
  componentDidMount() {
    const { loadMe } = this.props;
    loadMe();
  }

  render() {
    const { mode } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div
          style={{
            position: 'relative',
            margin: '0px auto',
            width: 1000,
          }}
        >
          <Header />
          <div
            id="contents"
            style={{
              position: 'absolute',
              top: 50,
            }}
          >
            {(mode === displayModes.HOME) ? (<Home />) : null}
            {(mode === displayModes.MAKE_QUESTION) ? (<MakeQuestion />) : null}
            {(mode === displayModes.PLAY_QUESTION) ? (<PlayQuestion />) : null}
            {(mode === displayModes.EDIT_QUESTION) ? (<EditQuestion />) : null}
            {(mode === displayModes.SEARCH) ? (<Search />) : null}
            {(mode === displayModes.USER) ? (<Profile />) : null}
            {(mode === displayModes.RANKING) ? (<Ranking />) : null}
          </div>
          <SignIn />
          <License />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  mode: PropTypes.string.isRequired,
  loadMe: PropTypes.func.isRequired,
};

export default App;
