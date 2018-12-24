import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router';
import { parse } from 'query-string';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

import PianoRoll from '../ui/PianoRoll';
import SoundPlayer from '../SoundPlayer';
import Note from '../../data/note';


const playModes = {
  STOP: 'STOP',
  PLAY: 'PLAY',
};

class EmbedPianoRoll extends React.Component {
  constructor(props) {
    super(props);

    // ex. http://localhost:5000/embed/pianoroll?notes=[{"start":0,"end":1,"pitch":60}]
    let notes = Immutable.List();
    const query = parse(location.search);
    if (query.notes !== undefined) {
      const queryNotes = JSON.parse(query.notes);
      for (let i = 0; i < queryNotes.length; i += 1) {
        notes = notes.push(new Note(queryNotes[i]));
      }
    }

    this.state = {
      playMode: playModes.STOP,
      currentBeat: null,
      startBeat: 0,
      notes,
      width: 0,
      height: 0,
      bpm: 120,
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

  componentDidMount() {
    this.setState({
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
    });
  }

  render() {
    const { playMode, currentBeat, startBeat, notes, width, height, bpm } = this.state;
    return (
      <div
        id="PianoRoll"
        style={{
          width: '100%',
          height: '100vh',
          backgroundColor: '#FFFFFF',
        }}
        ref={(element) => { this.element = element; }}
      >
        <Tooltip title="再生">
          <Button
            variant="fab"
            color="primary"
            aria-label="Play"
            style={{ position: 'absolute', top: 10, left: 10 }}
            onClick={() => {
              if (playMode === playModes.PLAY_ANSWER) {
                this.soundPlayer.stop();
                this.setState({
                  playMode: playModes.STOP,
                });
              } else {
                this.soundPlayer.play(notes, bpm, startBeat);
                this.setState({
                  playMode: playModes.PLAY_ANSWER,
                });
              }
            }}
          >
            {(playMode === playModes.PLAY_ANSWER) ? (<StopIcon />) : (<PlayArrowIcon />)}
          </Button>
        </Tooltip>
        <Typography
          style={{ position: 'absolute', top: 20, left: 100 }}
          variant="body1"
        >
          BPM
          {bpm}
        </Typography>
        <Tooltip title="BPMを変更">
          <Slider
            min={60}
            max={200}
            step={1}
            value={bpm}
            onChange={(e, v) => this.setState({ bpm: v })}
            style={{
              position: 'absolute',
              top: 50,
              left: 100,
              width: 200,
              height: 30,
            }}
          />
        </Tooltip>
        {(width > 0 && height > 0) ? (
          <PianoRoll
            style={{
              position: 'absolute',
              top: 100,
              height: height - 100,
              width,
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
        ) : null}
      </div>
    );
  }
}

EmbedPianoRoll.propTypes = {
};

export default withRouter(EmbedPianoRoll);
