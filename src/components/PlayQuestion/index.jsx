import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import SendIcon from '@material-ui/icons/Send';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

import PianoRollGrid from '../ui/PianoRollGrid';

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

class PlayQuestion extends React.Component {
  static evaluateAnswer(qMel, aMel) {
    /* 評価関数どうしますかね・・・

    Wasserstein距離？ 編集距離？ 重なりの面積？ 完全一致？ F-value? 音ゲー式？
    評価対象はノートオンのみ？

    qMel, aMel: ノーツオブジェクトを各要素にもつ array
                ノーツオブジェクト： {start:(ノートオン時刻[s]), end:(ノートオフ時刻[s]), pitch:(ノートナンバー)}
    */
    // 音ゲー式をまずは実装してみる．
    const qEventOfEachPitch = Array(128);
    for (let i = 0; i < 128; i += 1) qEventOfEachPitch[i] = new Array(0);
    const aEventOfEachPitch = Array(128);
    for (let i = 0; i < 128; i += 1) aEventOfEachPitch[i] = new Array(0);
    for (let i = 0; i < qMel.length; i += 1) qEventOfEachPitch[qMel[i].pitch].push(qMel[i].start);
    for (let i = 0; i < aMel.length; i += 1) aEventOfEachPitch[aMel[i].pitch].push(aMel[i].start);

    const redundantPenalty = -0.5; // [pt]
    const relevantInterval = 0.1; // [s]
    const scoreDecay = 0.1; // [s]
    let score = 0;

    for (let i = 0; i < 128; i += 1) { // ピッチごとに採点をする．
      if (qEventOfEachPitch[i].length === 0) {
        score += redundantPenalty * aEventOfEachPitch[i].length;
      } else {
        qEventOfEachPitch[i].sort((a, b) => a - b);
        aEventOfEachPitch[i].sort((a, b) => a - b);
        /*  回答の各ノーツを，時刻の早いものから順に見ていく．
            回答の各ノーツについて，
              その回答ノーツに「近接」した正解ノーツがある場合は
                それらの近接度に応じてスコアを加算し（同時なら満点），その正解ノーツを「削除」する．
              その回答ノーツに「近接」した正解ノーツがない場合は，
                スコアを減点する．
        */
        const check = Array(qEventOfEachPitch[i].length).fill(false);
        let qOffset = 0;
        for (let j = 0; j < aEventOfEachPitch[i].length; j += 1) {
          const t = aEventOfEachPitch[i][j];
          while (qOffset < qEventOfEachPitch[i].length
            && qEventOfEachPitch[i][qOffset] < t) qOffset += 1;

          let leftidx = qOffset - 1; // tの左側で，最も近接した「未チェックノート」との時間差
          while (leftidx >= 0 && check[leftidx]) leftidx -= 1;
          const left = (leftidx >= 0) ? (t - qEventOfEachPitch[i][leftidx]) : Infinity;

          let rightidx = qOffset; // tの右側で，最も近接した「未チェックノート」との時間差
          while (rightidx < qEventOfEachPitch[i].length
            && check[rightidx]) rightidx += 1;
          const right = (rightidx < qEventOfEachPitch[i].length)
            ? (qEventOfEachPitch[i][rightidx] - t) : Infinity;

          const minDist = Math.min(left, right);
          // console.log(minDist);
          if (minDist < relevantInterval) { // 「近接」した正解ノーツがある場合は
            score += Math.exp(-minDist / scoreDecay);
            check[(left < right) ? leftidx : rightidx] = true;
          } else { // 「近接」した正解ノーツがない場合は，
            score += redundantPenalty;
          }
        }
      }
    }
    score = Math.max(0, score);
    score *= 100 / qMel.length;

    return score;
  }

  static play(notes, bpm = 120) { // 一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    // bpm 例外処理・・・
    const secPerBeat = 60 / bpm;
    const timeEventTupleList = [];
    for (let i = 0; i < Object.values(notes).length; i += 1) {
      const note = Object.values(notes)[i];
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

  constructor(props) {
    super(props);
    this.state = {
      dialogOpened: false,
      dialogText: '',
    };
  }

  evaluateAndReport(qMel, aMel) {
    const score = PlayQuestion.evaluateAnswer(qMel, aMel);
    let message = '';
    message += `YOUR SCORE: ${score}\n`;
    // if (score >= 100) message += '!!! CONGRATULATION !!!';

    // スコアを表示．
    this.handleOpenDialog(message);
  }

  handleCloseDialog() {
    /* モーダルダイアログを閉じる */
    this.setState({ dialogOpened: false });
  }

  handleOpenDialog(message) {
    /* モーダルダイアログを開く */
    this.setState({ dialogOpened: true, dialogText: message });
  }

  handleClickLoadAsQuestion() {
    /*
      最新の問題をサーバーから取得して「現在の問題」にセットします．(アクション loadQuestionMelody)
      また，UIボタンの状態を適切に変更します．

      （なお「現在の回答」をサーバーに保存する手続きは，アクション uploadQuestionMelody として実装されている）
    */
    const { loadQuestionMelody } = this.props;
    loadQuestionMelody();
  }

  render() {
    const {
      notes, questionMelody, pitchRange, bpm, addNote, delNote, shiftPitchRange,
    } = this.props;
    const {
      dialogOpened,
      dialogText,
    } = this.state;
    return (
      <div id="PlayQuestion">
        <Button
          variant="fab"
          color="primary"
          aria-label="Play"
          style={{ position: 'absolute', top: 10, left: 10 }}
          onClick={() => PlayQuestion.play([...notes.values()], bpm)}
        >
          <PlayArrowIcon />
        </Button>

        <Button
          variant="fab"
          color="primary"
          aria-label="Load"
          style={{ position: 'absolute', top: 10, left: 80 }}
          onClick={() => this.handleClickLoadAsQuestion()}
        >
          <FolderIcon />
        </Button>
        <Button
          variant="fab"
          color="primary"
          aria-label="PlayQuestion"
          style={{ position: 'absolute', top: 10, left: 150 }}
          onClick={() => PlayQuestion.play([...questionMelody.values()], bpm)}
        >
          <PlayCircleOutlineIcon />
        </Button>
        <Button
          variant="fab"
          color="primary"
          aria-label="Submit"
          style={{ position: 'absolute', top: 10, left: 220 }}
          onClick={() => this.evaluateAndReport(
            [...questionMelody.values()], Object.values([...notes.values()]),
          )}
        >
          <SendIcon />
        </Button>

        <PianoRollGrid
          addNote={addNote}
          delNote={delNote}
          shiftPitchRange={shiftPitchRange}
          notes={notes}
          pitchRange={pitchRange}
        />

        <Dialog open={dialogOpened} onClose={() => this.handleCloseDialog()}>
          <DialogTitle id="simple-dialog-title">RESULT</DialogTitle>
          <DialogContent>
            <Typography>
              {dialogText}
            </Typography>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

PlayQuestion.propTypes = {
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
  questionMelody: PropTypes.instanceOf(Immutable.List).isRequired,
  pitchRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  bpm: PropTypes.number.isRequired,
  shiftPitchRange: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  loadQuestionMelody: PropTypes.func.isRequired,
};

export default PlayQuestion;
