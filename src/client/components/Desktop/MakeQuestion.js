import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import StopIcon from '@material-ui/icons/Stop';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import Slider from '@material-ui/lab/Slider';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router';

import PianoRoll from '../ui/PianoRoll';
import Question from '../../data/question';

import displayModes from '../../data/displayModes';

// import SoundPlayer from '../../SoundPlayer'; //新 (Web audio API スクラッチ実装)
import SoundPlayer from '../SoundPlayer'; // 旧 (Tone.Offline でオフライン録音)

const playModes = {
  STOP: 'STOP',
  PLAY: 'PLAY',
};

class MakeQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playMode: playModes.STOP,
      currentBeat: null,
      startBeat: 0,
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
    const { changeDisplayMode, } = this.props;
    changeDisplayMode(displayModes.MAKE_QUESTION);
    // clearNotes();
    // 「複製して編集」では，Search 画面から遷移する直前に notes に譜面が代入されるので
    // ここで clearNotes してしまうと，その譜面が消されてしまう．
  }

  render() {
    const {
      notes, bpm, title, addNote, delNote, setBPM,
      uploadQuestion, setTitle, clearNotes, history,
    } = this.props;
    const { playMode, currentBeat, startBeat } = this.state;
    return (
      <div id="MakeQuestion">
        <Helmet>
          <meta charSet="utf-8" />
          <title>問題を作成 - mimicOpus</title>
        </Helmet>

        <Tooltip title="タイトルを編集">
          <Input
            placeholder="Untitled"
            inputProps={{
              'aria-label': 'Description',
            }}
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              position: 'absolute', top: 10, left: 10, height: 40, width: 180,
            }}
          />
        </Tooltip>
        <Tooltip title="再生">
          <Button
            variant="fab"
            color="primary"
            aria-label="Play"
            style={{ position: 'absolute', top: 10, left: 210 }}
            onClick={() => {
              if (playMode === playModes.PLAY) {
                this.soundPlayer.stop();
                this.setState({
                  playMode: playModes.STOP,
                });
              } else {
                this.soundPlayer.play(notes, bpm, startBeat);
                this.setState({
                  playMode: playModes.PLAY,
                });
              }
            }}
          >
            {(playMode === playModes.PLAY) ? (<StopIcon />) : (<PlayArrowIcon />)}
          </Button>
        </Tooltip>
        <Typography
          style={{ position: 'absolute', top: 10, left: 300 }}
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
            onChange={(e, v) => setBPM(v)}
            style={{
              position: 'absolute',
              top: 40,
              left: 300,
              width: 200,
              height: 30,
            }}
          />
        </Tooltip>
        <Tooltip title="問題を保存">
          <Button
            variant="fab"
            color="primary"
            aria-label="Save"
            style={{ position: 'absolute', top: 10, left: 550 }}
            onClick={() => {
              uploadQuestion(new Question({
                notes,
                bpm,
                title: (title !== '') ? title : 'Untitled',
              }));
              clearNotes();
              setBPM(120);
              history.push('/');
            }}
          >
            <SaveIcon />
          </Button>
        </Tooltip>

        <PianoRoll
          style={{
            position: 'absolute',
            top: 100,
            height: 500,
            width: 1000,
          }}
          notes={notes}
          addNote={addNote}
          deleteNote={delNote}
          currentBeats={(currentBeat !== null) ? currentBeat : startBeat}
          startBeats={startBeat}
          previewSound={pitch => this.soundPlayer.preview(pitch)}
          onChangeStartBeat={(newStartBeat) => { this.setState({ startBeat: newStartBeat }); }}
        />
      </div>
    );
  }
}

MakeQuestion.propTypes = {
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
  bpm: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  setBPM: PropTypes.func.isRequired,
  uploadQuestion: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  clearNotes: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default withRouter(MakeQuestion);
