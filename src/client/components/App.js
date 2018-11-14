import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';

import SignIn from '../containers/SignIn';
import License from '../containers/License';
import FAQ from '../containers/FAQ';
import Header from '../containers/Header';

import Home from '../containers/Home';
import MakeQuestion from '../containers/MakeQuestion';
import PlayQuestion from '../containers/PlayQuestion';
import Search from '../containers/Search';
import Profile from '../containers/Profile';
import Ranking from '../containers/Ranking';

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
        <div
          style={{
            position: 'relative',
            margin: '0px auto',
            width: 1000,
          }}
        >
          <Header />
          <ConnectedRouter history={history}>
            <div
              id="contents"
              style={{
                position: 'absolute',
                top: 50,
              }}
            >

              <Route component={Tracker} />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/makequestion" component={MakeQuestion} />
                <Route path="/playquestion" component={PlayQuestion} />
                <Route path="/search" component={Search} />
                <Route path="/user" component={Profile} />
                <Route path="/ranking" component={Ranking} />
              </Switch>
            </div>
          </ConnectedRouter>
          <SignIn />
          <License />
          <FAQ />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  loadMe: PropTypes.func.isRequired,
};

export default App;
