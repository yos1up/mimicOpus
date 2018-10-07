import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import displayModes from '../../data/displayModes';

// サンプラー
const sampler = new Tone.Sampler({
  C2: 'C2.wav',
  E2: 'E2.wav',
  Ab2: 'Ab2.wav',
  C3: 'C3.wav',
  E3: 'E3.wav',
  Ab3: 'Ab3.wav',
  C4: 'C4.wav',
  E4: 'E4.wav',
  Ab4: 'Ab4.wav',
  C5: 'C5.wav',
  E5: 'E5.wav',
  Ab5: 'Ab5.wav',
  C6: 'C6.wav',
}, {
  release: 1,
  onload: () => {
    // sampler will repitch the closest sample
    sampler.toMaster();
    // console.log('sampler successfully loaded!');
  },
  baseUrl: './instrument_piano/',
});
Tone.Transport.start();


function noteNumberToPitchName(nn) {
  return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][nn % 12] + (Math.floor(nn / 12) - 1);
}

class Search extends React.Component {
  static play(notes, bpm = 120) { // 一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    // bpm 例外処理・・・
    const secPerBeat = 60 / bpm;
    const timeEventTupleList = [];
    for (let i = 0; i < notes.size; i += 1) {
      const note = notes.get(i);
      timeEventTupleList.push(
        [note.start * secPerBeat, [note.pitch, (note.end - note.start) * secPerBeat]],
      );
    }
    const melody = new Tone.Part(
      (time, event) => {
        sampler.triggerAttackRelease(
          noteNumberToPitchName(event[0]), event[1], time, 1,
        ); // 引数は，おそらく (音高，音長，絶対時刻[s]，ベロシティ[0~1])
      }, timeEventTupleList,
    );
    melody.start(Tone.now()); // 先に Tone.Transport.start() してある必要がある．
  }

  componentDidMount() {
    const { lowBPM, highBPM, loadQuestionsList } = this.props;
    loadQuestionsList(lowBPM, highBPM);
  }

  render() {
    const {
      questionsList, lowBPM, highBPM, setQuestion, changeDisplayMode, setBPM, setLowBPM, setHighBPM,
      loadQuestionsList, setQuestionId,
    } = this.props;
    return (
      <div id="Search">
        <div id="bpm picker">
          <Typography
            style={{
              position: 'absolute', top: 0, left: 10, width: 180,
            }}
          >
            BPM
          </Typography>
          <FormControl
            style={{
              position: 'absolute', top: 20, left: 10, width: 100,
            }}
          >
            <Select
              value={lowBPM}
              onChange={(e) => {
                setLowBPM(e.target.value);
                loadQuestionsList(e.target.value, highBPM);
              }}
              displayEmpty
            >
              <MenuItem value={60}>60</MenuItem>
              <MenuItem value={70}>70</MenuItem>
              <MenuItem value={80}>80</MenuItem>
            </Select>
          </FormControl>
          <Typography
            style={{
              position: 'absolute', top: 30, left: 120, width: 20,
            }}
          >
            ~
          </Typography>
          <FormControl
            style={{
              position: 'absolute', top: 20, left: 140, width: 100,
            }}
          >
            <Select
              value={highBPM}
              onChange={(e) => {
                setHighBPM(e.target.value);
                loadQuestionsList(lowBPM, e.target.value);
              }}
              displayEmpty
            >
              <MenuItem value={180}>180</MenuItem>
              <MenuItem value={190}>190</MenuItem>
              <MenuItem value={200}>200</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Table
          style={{
            position: 'absolute',
            top: 60,
            left: 0,
            width: 1000,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Questions</TableCell>
              <TableCell>BPM</TableCell>
              <TableCell>User</TableCell>
              <TableCell>uploadedAt</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {// TODO do not use array index
              [...questionsList.entries()].map((tmpV) => {
                const k = tmpV[0];
                const v = tmpV[1];
                let date = v.uploadedAt.toDate();
                date = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
                return (
                  <TableRow
                    key={k}
                    hover
                    onClick={() => {
                      setQuestion(v);
                      setBPM(v.bpm);
                      changeDisplayMode(displayModes.PLAY_QUESTION);
                      setQuestionId(k);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <IconButton
                        aria-label="Play"
                        onClick={(e) => {
                          Search.play(v.notes, v.bpm);
                          e.stopPropagation();
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {v.title}
                    </TableCell>
                    <TableCell>{v.bpm}</TableCell>
                    <TableCell>{v.userName}</TableCell>
                    <TableCell>{date}</TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

Search.propTypes = {
  questionsList: PropTypes.instanceOf(Immutable.Map).isRequired,
  lowBPM: PropTypes.number.isRequired,
  highBPM: PropTypes.number.isRequired,
  setQuestion: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
  setBPM: PropTypes.func.isRequired,
  setLowBPM: PropTypes.func.isRequired,
  setHighBPM: PropTypes.func.isRequired,
  loadQuestionsList: PropTypes.func.isRequired,
  setQuestionId: PropTypes.func.isRequired,
};

export default Search;
