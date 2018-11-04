import { connect } from 'react-redux';

import {
  addNote, delNote, shiftPitchRange, setBPM,
  uploadQuestion, saveAnswer, clearNotes, changeDisplayMode,
} from '../../actions';
import PlayQuestion from '../../components/PlayQuestion';

const mapStateToProps = state => ({
  notes: state.music.notes,
  question: state.music.question,
  pitchRange: state.music.pitchRange,
  bpm: state.music.bpm,
  questionId: state.music.questionId,
});

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  clearNotes: () => dispatch(clearNotes()),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  uploadQuestion,
  saveAnswer,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayQuestion);
