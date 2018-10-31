import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SaveIcon from '@material-ui/icons/Save';
import Slider from '@material-ui/lab/Slider';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';

import PianoRollGrid from '../ui/PianoRollGrid';
import Question from '../../data/question';

import displayModes from '../../data/displayModes';

import SoundPlayer from '../SoundPlayer';


class MakeQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.soundPlayer = new SoundPlayer();
  }

  render() {
    const {
      notes, pitchRange, bpm, title, addNote, delNote, shiftPitchRange, setBPM,
      uploadQuestion, setTitle, clearNotes, changeDisplayMode,
    } = this.props;
    return (
      <div id="MakeQuestion">

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
            onClick={() => this.soundPlayer.play(notes, bpm)}
          >
            <PlayArrowIcon />
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
              changeDisplayMode(displayModes.HOME);
            }}
          >
            <SaveIcon />
          </Button>
        </Tooltip>

        <PianoRollGrid
          addNote={addNote}
          delNote={delNote}
          shiftPitchRange={shiftPitchRange}
          notes={notes}
          pitchRange={pitchRange}
          soundPlayer={this.soundPlayer}
        />
      </div>
    );
  }
}

MakeQuestion.propTypes = {
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
  pitchRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  bpm: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  shiftPitchRange: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  setBPM: PropTypes.func.isRequired,
  uploadQuestion: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  clearNotes: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default MakeQuestion;
