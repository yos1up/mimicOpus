import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import StopIcon from '@material-ui/icons/Stop';
import SendIcon from '@material-ui/icons/Send';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import StartSetter from '../ui/StartSetter';
import PianoRollGrid from '../ui/PianoRollGrid';
import Question from '../../data/question';
import SoundPlayer from '../SoundPlayer';
import displayModes from '../../data/displayModes';

const playModes = {
  STOP: 'STOP',
  PLAY_ANSWER: 'PLAY_ANSWER',
  PLAY_QUESTION: 'PLAY_QUESTION',
};


class PlayQuestion extends React.Component {
  static evaluateAnswer(qNotes, aNotes) {
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
    for (let i = 0; i < qNotes.size; i += 1) {
      qEventOfEachPitch[qNotes.get(i).pitch].push(qNotes.get(i).start);
    }
    for (let i = 0; i < aNotes.size; i += 1) {
      aEventOfEachPitch[aNotes.get(i).pitch].push(aNotes.get(i).start);
    }

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
    score *= 100 / qNotes.size;

    return score;
  }

  constructor(props) {
    super(props);
    this.state = {
      dialogOpened: false,
      dialogText: '',
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
    const { changeDisplayMode, clearNotes } = this.props;
    clearNotes();
    changeDisplayMode(displayModes.PLAY_QUESTION);
  }

  evaluateAndReport(qNotes, aNotes) {
    const { questionId, saveAnswer } = this.props;
    let score = PlayQuestion.evaluateAnswer(qNotes, aNotes);
    if (score !== undefined && score !== null) {
      score = parseFloat(score).toFixed(2);
    } else {
      score = 'Nothing';
    }
    let message = '';
    message += `YOUR SCORE: ${score}\n`;
    // if (score >= 100) message += '!!! CONGRATULATION !!!';

    // スコアを表示．
    this.handleOpenDialog(message);

    // データベースとうろく
    saveAnswer(questionId, aNotes, score);
  }

  handleCloseDialog() {
    /* モーダルダイアログを閉じる */
    this.setState({ dialogOpened: false });
  }

  handleOpenDialog(message) {
    /* モーダルダイアログを開く */
    this.setState({ dialogOpened: true, dialogText: message });
  }

  render() {
    const {
      notes, question, pitchRange, bpm, addNote, delNote,
      shiftPitchRange,
    } = this.props;
    const {
      dialogOpened,
      dialogText,
      playMode,
      currentBeat,
      startBeat,
    } = this.state;
    return (
      <div id="PlayQuestion">
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

        <Tooltip title="問題を再生">
          <Button
            variant="fab"
            color="primary"
            aria-label="PlayQuestion"
            style={{ position: 'absolute', top: 10, left: 80 }}
            onClick={() => {
              if (playMode === playModes.PLAY_QUESTION) {
                this.soundPlayer.stop();
                this.setState({
                  playMode: playModes.STOP,
                });
              } else {
                this.soundPlayer.play(question.notes, question.bpm, startBeat);
                this.setState({
                  playMode: playModes.PLAY_QUESTION,
                });
              }
            }}
          >
            {(playMode === playModes.PLAY_QUESTION) ? (<StopIcon />) : (<PlayCircleOutlineIcon />)}
          </Button>
        </Tooltip>

        <Tooltip title="提出">
          <Button
            variant="fab"
            color="primary"
            aria-label="Submit"
            style={{ position: 'absolute', top: 10, left: 150 }}
            onClick={() => this.evaluateAndReport(
              question.notes, notes,
            )}
          >
            <SendIcon />
          </Button>
        </Tooltip>

        <StartSetter
          style={{
            position: 'absolute', left: 36, top: 100, height: 30, width: 896,
          }}
          startBeat={startBeat}
          totalBeat={16}
          onChangeStartBeat={(newStartBeat) => { this.setState({ startBeat: newStartBeat }); }}
        />
        <div style={{ position: 'absolute', top: 130 }}>
          <PianoRollGrid
            addNote={addNote}
            delNote={delNote}
            shiftPitchRange={shiftPitchRange}
            notes={notes}
            pitchRange={pitchRange}
            soundPlayer={this.soundPlayer}
            currentBeat={(currentBeat !== null) ? currentBeat : startBeat}
          />
        </div>

        <Dialog
          open={dialogOpened}
          onClose={() => {
            this.handleCloseDialog();
          }}
        >
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
  question: PropTypes.instanceOf(Question).isRequired,
  pitchRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  questionId: PropTypes.string.isRequired,
  bpm: PropTypes.number.isRequired,
  shiftPitchRange: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  clearNotes: PropTypes.func.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default PlayQuestion;
