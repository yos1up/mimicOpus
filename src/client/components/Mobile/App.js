import React from 'react';
import { Route, Switch } from 'react-router';

import SignIn from '../../containers/SignIn';
import License from '../../containers/License';
import FAQ from '../../containers/FAQ';
import Header from '../../containers/Mobile/Header';
import Home from '../../containers/Mobile/Home';
import MakeQuestion from '../../containers/Mobile/MakeQuestion';
import PlayQuestion from '../../containers/Mobile/PlayQuestion';
import Search from '../../containers/Mobile/Search';
import Profile from '../../containers/Mobile/Profile';
import Ranking from '../../containers/Mobile/Ranking';
import Tracker from '../Tracker';


class MobileApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: null,
      height: null,
    };
  }

  componentDidMount() {
    this.setState({
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
    });
  }

  render() {
    const { height } = this.state;
    return (
      <div
        id="mobileApp"
        style={{
          width: '100%',
          height: '100vh',
        }}
        ref={(element) => { this.element = element; }}
      >
        <Header />
        <div
          id="contents"
          style={{
            position: 'absolute',
            top: 100,
            width: '100%',
            height: height - 100,
          }}
        >
          <Route component={Tracker} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/makequestion" component={MakeQuestion} />
            <Route path="/playquestion/:qid" component={PlayQuestion} />
            <Route path="/search" component={Search} />
            <Route path="/user" component={Profile} />
            <Route path="/ranking" component={Ranking} />
          </Switch>
        </div>
        <SignIn />
        <License />
        <FAQ />
      </div>
    );
  }
}

export default MobileApp;
