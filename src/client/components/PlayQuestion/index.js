import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

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
import CircularProgress from '@material-ui/core/CircularProgress';
import { TwitterShareButton } from 'react-twitter-embed';

import StartSetter from '../ui/StartSetter';
import PianoRollGrid from '../ui/PianoRollGrid';
import Question from '../../data/question';
// import SoundPlayer from '../../SoundPlayer'; //新 (Web audio API スクラッチ実装)
import SoundPlayer from '../SoundPlayer'; // 旧 (Tone.Offline でオフライン録音)
import displayModes from '../../data/displayModes';

const playModes = {
  STOP: 'STOP',
  PLAY_ANSWER: 'PLAY_ANSWER',
  PLAY_QUESTION: 'PLAY_QUESTION',
};


class PlayQuestion extends React.Component {
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
    const {
      changeDisplayMode, clearNotes, loadBestSubmission, match, loadQuestion,
    } = this.props;
    clearNotes();

    /*
      過去に行った回答があるならば，それをセットしたい．
    */
    loadBestSubmission(match.params.qid);

    changeDisplayMode(displayModes.PLAY_QUESTION);
    loadQuestion(match.params.qid);
  }

  render() {
    const {
      notes, question, pitchRange, addNote, delNote,
      shiftPitchRange, questionId, submitAnswer, isOpenScoreDialog,
      textScoreDialog, closeScoreDialog, waitingLoadQuestion,
    } = this.props;
    const {
      playMode,
      currentBeat,
      startBeat,
    } = this.state;
    return (
      <div id="PlayQuestion">
        {(waitingLoadQuestion === false) ? (
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{`${question.title} - ${question.displayName}`}</title>
            </Helmet>
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
                    this.soundPlayer.play(notes, question.bpm, startBeat);
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
                    if (!this.soundPlayer.playRecord('question', startBeat)) { // 未録音の場合．（初回の問題再生時）
                      this.soundPlayer.offlineRecord( // 録音を行う
                        'question',
                        question.notes,
                        question.bpm,
                        () => { this.soundPlayer.playRecord('question', startBeat); } // 録音終了次第，再生
                      );
                    } else { // すでに録音されたものがある場合．（2回目以降の問題再生時）
                      this.soundPlayer.playRecord('question', startBeat); // 再生
                    }
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
                onClick={() => {
                  submitAnswer(questionId, notes);
                }}
              >
                <SendIcon />
              </Button>
            </Tooltip>

            <div
              style={{
                position: 'absolute', top: 25, left: 220, width: 1000,
              }}
            >
              <TwitterShareButton
                url={`https://www.mimicopus.com/playquestion/${questionId}`}
                options={{ text: `${question.title} - ${question.displayName} #mimicOpus`, size: 'large' }}
              />
            </div>

            <Typography
              variant="h4"
              color="textPrimary"
              style={{
                position: 'absolute', top: 5, left: 310, width: 1000,
              }}
            >
              {question.title}
            </Typography>
            <Typography
              variant="h8"
              color="textPrimary"
              style={{
                position: 'absolute', top: 45, left: 310, width: 1000,
              }}
            >
              {question.displayName}
            </Typography>

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
              open={isOpenScoreDialog}
              onClose={() => {
                closeScoreDialog();
              }}
            >
              <DialogTitle id="simple-dialog-title">RESULT</DialogTitle>
              <DialogContent>
                <Typography>
                  {textScoreDialog}
                </Typography>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <CircularProgress
            style={{
              position: 'absolute',
              left: 400,
            }}
          />
        )}

      </div>
    );
  }
}

PlayQuestion.propTypes = {
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
  question: PropTypes.instanceOf(Question).isRequired,
  pitchRange: PropTypes.arrayOf(PropTypes.number).isRequired,
  questionId: PropTypes.string.isRequired,
  isOpenScoreDialog: PropTypes.bool.isRequired,
  waitingLoadQuestion: PropTypes.bool.isRequired,
  textScoreDialog: PropTypes.string.isRequired,
  shiftPitchRange: PropTypes.func.isRequired,
  addNote: PropTypes.func.isRequired,
  delNote: PropTypes.func.isRequired,
  clearNotes: PropTypes.func.isRequired,
  submitAnswer: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
  loadBestSubmission: PropTypes.func.isRequired,
  closeScoreDialog: PropTypes.func.isRequired,
  loadQuestion: PropTypes.func.isRequired,
};

export default PlayQuestion;
