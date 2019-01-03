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
import CircularProgress from '@material-ui/core/CircularProgress';
import { TwitterShareButton } from 'react-twitter-embed';

import PianoRoll from '../ui/PianoRoll';
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
      width: null,
      height: null,
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
      notes, question, addNote, delNote,
      questionId, submitAnswer, isOpenScoreDialog,
      textScoreDialog, closeScoreDialog, waitingLoadQuestion,
    } = this.props;
    const {
      playMode,
      currentBeat,
      startBeat,
      width,
      height,
    } = this.state;
    return (
      <div
        id="PlayQuestion"
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
        }}
        ref={(element) => {
          const { width: width_, height: height_ } = this.state;
          this.element = element;
          if (this.element !== null
            && (this.element.offsetWidth !== width_
            || this.element.offsetHeight !== height_)) {
            this.setState({
              width: this.element.offsetWidth,
              height: this.element.offsetHeight,
            });
          }
        }}
      >
        {(waitingLoadQuestion === false) ? (
          <div>
            <Helmet>
              <meta charSet="utf-8" />
              <title>{`${question.title} - ${question.displayName}`}</title>
            </Helmet>

            <Typography
              variant="subtitle1"
              color="textPrimary"
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                width: 200,
                overflow: 'hidden',
                fontWeight: 'bold',
              }}
            >
              {question.title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textPrimary"
              style={{
                position: 'absolute',
                top: 40,
                left: 10,
                width: 100,
                overflow: 'hidden',
                fontWeight: 'normal',
                color: '#777777',
              }}
            >
              {question.displayName}
            </Typography>
            <div
              style={{
                position: 'absolute', top: 40, left: 120,
              }}
            >
              <TwitterShareButton
                url={`https://www.mimicopus.com/playquestion/${questionId}`}
                options={{ text: `${question.title} - ${question.displayName} #mimicOpus`, size: 'large' }}
              />
            </div>

            <Button
              variant="fab"
              color="primary"
              aria-label="Play"
              style={{ position: 'absolute', top: 10, left: 230 }}
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

            <Button
              variant="fab"
              color="primary"
              aria-label="PlayQuestion"
              style={{ position: 'absolute', top: 10, left: 290 }}
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

            <Button
              variant="fab"
              color="primary"
              aria-label="Submit"
              style={{ position: 'absolute', top: 10, left: 350 }}
              onClick={() => {
                submitAnswer(questionId, notes);
              }}
            >
              <SendIcon />
            </Button>

            {(height > 0) ? (
              <PianoRoll
                style={{
                  position: 'absolute',
                  top: 100,
                  left: 10,
                  height: height - 110,
                  width: width - 20,
                }}
                notes={notes}
                addNote={addNote}
                deleteNote={delNote}
                currentBeats={(currentBeat !== null) ? currentBeat : startBeat}
                startBeats={startBeat}
                previewSound={pitch => this.soundPlayer.preview(pitch)}
                onChangeStartBeat={(newStartBeat) => { this.setState({ startBeat: newStartBeat }); }}
              />
            ) : null }

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
              left: 200,
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
  questionId: PropTypes.string.isRequired,
  isOpenScoreDialog: PropTypes.bool.isRequired,
  waitingLoadQuestion: PropTypes.bool.isRequired,
  textScoreDialog: PropTypes.string.isRequired,
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
