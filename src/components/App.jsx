import React from 'react';
import firebase from 'firebase';

import PianoRollGrid from '../containers/PianoRollGrid';
import Menu from '../containers/Menu';
import SignIn from '../containers/SignIn';


class App extends React.Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((/* user */) => {
      // ここにユーザー変わった時の処理を入れます
      // console.log(user);
    });
  }

  render() {
    return (
      <div
        style={{
          position: 'relative',
          margin: '0px auto',
          width: 850,
          height: 350,
        }}
      >
        <Menu />
        <PianoRollGrid pitchRange={[60, 72]} />
        <SignIn />
      </div>
    );
  }
}

export default App;
