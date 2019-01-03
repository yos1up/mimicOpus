import React from 'react';
import { Route, Switch } from 'react-router';

import SignIn from '../../containers/SignIn';
import License from '../../containers/License';
import FAQ from '../../containers/FAQ';
import Header from '../../containers/Mobile/Header';
import Tracker from '../Tracker';


function MobileApp() {
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Header />
      <div
        id="contents"
        style={{
          position: 'absolute',
          top: 100,
          width: '100%',
        }}
      >
        <Route component={Tracker} />
        <Switch>
        </Switch>
      </div>
      <SignIn />
      <License />
      <FAQ />
    </div>
  );
}

export default MobileApp;
