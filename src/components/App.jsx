import React from 'react';
import firebase from 'firebase';
import PropTypes from 'prop-types';

import PianoRollGrid from '../containers/PianoRollGrid';
import Menu from '../containers/Menu';
import SignIn from '../containers/SignIn';
import QuestionsList from '../containers/QuestionsList';
import Header from '../containers/Header';


class App extends React.Component {
  componentDidMount() {
    const { setUid, setUimage, loadQuestionsList } = this.props;
    firebase.auth().onAuthStateChanged((user) => {
      setUid(user.uid);
      setUimage(user.photoURL);
    });
    loadQuestionsList();
  }

  render() {
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
          <Menu />
          <PianoRollGrid />
          <SignIn />
          <QuestionsList />
        </div>
      </div>
    );
  }
}

App.propTypes = {
  setUid: PropTypes.func.isRequired,
  setUimage: PropTypes.func.isRequired,
  loadQuestionsList: PropTypes.func.isRequired,
};

export default App;
