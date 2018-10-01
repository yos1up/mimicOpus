import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';

import PianoRollGrid from '../containers/PianoRollGrid';
import Menu from '../containers/Menu';
import SignIn from '../containers/SignIn';


class App extends React.Component {
  componentDidMount() {
    const { setUid, setUimage } = this.props;
    firebase.auth().onAuthStateChanged((user) => {
      setUid(user.uid);
      setUimage(user.photoURL);
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
        <PianoRollGrid />
        <SignIn />
      </div>
    );
  }
}

App.propTypes = {
  setUid: PropTypes.func.isRequired,
  setUimage: PropTypes.func.isRequired,
};

export default App;
