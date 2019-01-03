import React from 'react';
import { Route, Switch } from 'react-router';

import SignIn from '../../containers/SignIn';
import License from '../../containers/License';
import FAQ from '../../containers/FAQ';
import Header from '../../containers/Desktop/Header';
import Home from '../../containers/Desktop/Home';
import MakeQuestion from '../../containers/Desktop/MakeQuestion';
import PlayQuestion from '../../containers/Desktop/PlayQuestion';
import Search from '../../containers/Desktop/Search';
import Profile from '../../containers/Desktop/Profile';
import Ranking from '../../containers/Desktop/Ranking';
import MakeEmbedPianoRoll from '../../containers/Desktop/MakeEmbedPianoRoll';
import Tracker from '../Tracker';


function DesktopApp() {
  return (
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
        <Route component={Tracker} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/makequestion" component={MakeQuestion} />
          <Route path="/playquestion/:qid" component={PlayQuestion} />
          <Route path="/search" component={Search} />
          <Route path="/user" component={Profile} />
          <Route path="/ranking" component={Ranking} />
          <Route path="/makeembedpianoroll" component={MakeEmbedPianoRoll} />
        </Switch>
      </div>
      <SignIn />
      <License />
      <FAQ />
    </div>
  );
}

export default DesktopApp;
