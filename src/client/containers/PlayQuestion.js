import { connect } from 'react-redux';

import {
  addNote, delNote, shiftPitchRange, setBPM, loadBestSubmission, setNotes,
  uploadQuestion, clearNotes, changeDisplayMode, submitAnswer,
  closeScoreDialog, loadQuestion,
} from '../actions';
import PlayQuestion from '../components/PlayQuestion';

const mapStateToProps = state => ({
  notes: state.music.notes,
  question: state.music.question,
  pitchRange: state.music.pitchRange,
  bpm: state.music.bpm,
  questionId: state.music.questionId,
  isOpenScoreDialog: state.music.isOpenScoreDialog,
  textScoreDialog: state.music.textScoreDialog,
  waitingLoadQuestion: state.display.waitingLoadQuestion,
});

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  clearNotes: () => dispatch(clearNotes()),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  loadBestSubmission: qid => loadBestSubmission(dispatch, qid),
  setNotes: notes => dispatch(setNotes(notes)),
  uploadQuestion,
  submitAnswer: (qid, notes) => submitAnswer(dispatch, qid, notes),
  closeScoreDialog: () => dispatch(closeScoreDialog()),
  loadQuestion: qid => loadQuestion(dispatch, qid),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayQuestion);
