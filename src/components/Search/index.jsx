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

  render() {
    const { questionsList } = this.props;
    return (
      <div id="Search">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Melodies</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {// TODO do not use array index
              questionsList.map((item, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <IconButton aria-label="Play" onClick={() => Search.play(questionsList.get(idx).notes, questionsList.get(idx).bpm)}>
                      <PlayArrowIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    question
                    {idx}
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}

Search.propTypes = {
  questionsList: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default Search;
