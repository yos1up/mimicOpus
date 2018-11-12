import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';

import SignIn from '../containers/SignIn';
import License from '../containers/License';
import FAQ from '../containers/FAQ';
import Header from '../containers/Header';

import Home from '../containers/Home';
import EditQuestion from '../containers/EditQuestion';
import MakeQuestion from '../containers/MakeQuestion';
import PlayQuestion from '../containers/PlayQuestion';
import Search from '../containers/Search';
import Profile from '../containers/Profile';
import Ranking from '../containers/Ranking';

import { history } from '../configureStore';

import theme from './theme';


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
          <Link to="/search">
            sss
          </Link>
          <Header />
          <ConnectedRouter history={history}>
            <div
              id="contents"
              style={{
                position: 'absolute',
                top: 50,
              }}
            >
              <Switch>
                <Route exact path="/" component={Home} onEnter={() => console.log('Home')} />
                <Route path="/makequestion" component={MakeQuestion} onEnter={() => console.log('makequestion')} />
                <Route path="/playquestion" component={PlayQuestion} onEnter={() => console.log('playquestion')} />
                <Route path="/editquestion" component={EditQuestion} onEnter={() => console.log('editquestion')} />
                <Route path="/search" component={Search} onEnter={() => console.log('search')} />
                <Route path="/user" component={Profile} onEnter={() => console.log('user')} />
                <Route path="/ranking" component={Ranking} onEnter={() => console.log('ranking')} />
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
