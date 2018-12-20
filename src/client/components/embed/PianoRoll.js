import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';

import PianoRollGrid from '../ui/PianoRollGrid';
import SoundPlayer from '../SoundPlayer';


const playModes = {
  STOP: 'STOP',
  PLAY: 'PLAY',
};

class PianoRoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playMode: playModes.STOP,
      currentBeat: null,
      startBeat: 0,
      notes: Immutable.List(),
    };
    this.soundPlayer = new SoundPlayer(50, (beats) => {
      if (beats > 16) {
        this.soundPlayer.stop();
        this.setState({ playMode: playModes.STOP });
      } else {
        this.setState({ currentBeat: beats });
      }
    });
  }

  render() {
    const { playMode, currentBeat, startBeat, notes } = this.state;
    return (
      <div
        id="PianoRoll"
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#FFFFFF',
        }}
      >
        <PianoRollGrid
          soundPlayer={this.soundPlayer}
          notes={notes}
          addNote={(note) => {
            this.setState({ notes: notes.push(note) });
          }}
          delNote={(idx) => {
            this.setState({ notes: notes.delete(idx) });
          }}
          currentBeat={(currentBeat !== null) ? currentBeat : startBeat}
        />
      </div>
    );
  }
}

PianoRoll.propTypes = {
};

export default withRouter(PianoRoll);
