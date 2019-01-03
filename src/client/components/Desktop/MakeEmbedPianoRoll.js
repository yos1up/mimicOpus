import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import CodeIcon from '@material-ui/icons/Code';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Slider from '@material-ui/lab/Slider';
import TextField from '@material-ui/core/TextField';

import PianoRoll from '../ui/PianoRoll';
// import SoundPlayer from '../../SoundPlayer'; //新 (Web audio API スクラッチ実装)
import SoundPlayer from '../SoundPlayer'; // 旧 (Tone.Offline でオフライン録音)
import displayModes from '../../data/displayModes';

const playModes = {
  STOP: 'STOP',
  PLAY: 'PLAY',
};

class MakeEmbedPianoRoll extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: Immutable.List(),
      playMode: playModes.STOP,
      currentBeat: 0,
      startBeat: 0,
      bpm: 120,
      code: '',
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
    const { changeDisplayMode } = this.props;
    changeDisplayMode(displayModes.MAKE_EMBED_PIANO_ROLL);
  }

  render() {
    const {
      notes, playMode, currentBeat, startBeat, bpm, code,
    } = this.state;
    return (
      <div
        id="MakeEmbedPianoRoll"
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
        <Tooltip title="埋め込みピアノロール作成">
          <Button
            variant="fab"
            color="primary"
            aria-label="Export"
            style={{ position: 'absolute', top: 10, left: 330 }}
            onClick={() => {
              if (notes.size > 0) {
                this.setState({
                  code:
`<iframe
  width="800"
  height="400"
  frameBorder="0"
  src='https://www.mimicopus.com/embed/pianoroll?notes=${JSON.stringify(notes)}'
/>`
                });
              } else {
                this.setState({
                  code:
`<iframe
  width="800"
  height="400"
  frameBorder="0"
  src='https://www.mimicopus.com/embed/pianoroll'
/>`
                });
              }
            }}
          >
            <CodeIcon />
          </Button>
        </Tooltip>
        <TextField
          style={{
            position: 'absolute', top: 10, left: 410, height: 70, width: 500,
          }}
          multiline
          inputProps={{
            'aria-label': 'Description',
          }}
          value={code}
          onChange={e => this.setState({ code: e.target.value })}
        />
        <PianoRoll
          style={{
            position: 'absolute',
            top: 100,
            height: 500,
            width: 1000,
          }}
          notes={notes}
          addNote={note => this.setState({ notes: notes.push(note) })}
          deleteNote={idx => this.setState({ notes: notes.remove(idx) })}
          currentBeats={(currentBeat !== null) ? currentBeat : startBeat}
          startBeats={startBeat}
          previewSound={pitch => this.soundPlayer.preview(pitch)}
          onChangeStartBeat={(newStartBeat) => { this.setState({ startBeat: newStartBeat }); }}
        />
      </div>
    );
  }
}

export default MakeEmbedPianoRoll;
