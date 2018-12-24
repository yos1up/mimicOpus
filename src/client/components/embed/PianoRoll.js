import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';

import PianoRoll from '../ui/PianoRoll';
import SoundPlayer from '../SoundPlayer';


const playModes = {
  STOP: 'STOP',
  PLAY: 'PLAY',
};

class EmbedPianoRoll extends React.Component {
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
        <PianoRoll
          style={{
            position: 'absolute',
            top: 100,
            height: 500,
            width: '100%',
          }}
          notes={notes}
          addNote={(note) => {
            this.setState({ notes: notes.push(note) });
          }}
          deleteNote={(idx) => {
            this.setState({ notes: notes.delete(idx) });
          }}
          currentBeats={(currentBeat !== null) ? currentBeat : startBeat}
          startBeats={startBeat}
          previewSound={pitch => this.soundPlayer.preview(pitch)}
          onChangeStartBeat={(newStartBeat) => { this.setState({ startBeat: newStartBeat }); }}
        />
      </div>
    );
  }
}

EmbedPianoRoll.propTypes = {
};

export default withRouter(EmbedPianoRoll);
