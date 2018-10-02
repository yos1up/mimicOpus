import { connect } from 'react-redux';

import {
  clearNotes,
  addNote,
  delNote,
  setQuestionMelody,
  setBPM,
  uploadQuestionMelody,
  loadQuestionMelody,
  openSignInDialog,
} from '../actions';
import Menu from '../components/Menu';

const mapStateToProps = state => ({
  notes: state.music.notes,
  questionMelody: state.music.questionMelody,
  bpm: state.music.bpm,
  uimage: state.auth.uimage,
  uid: state.auth.uid,
});

const mapDispatchToProps = dispatch => ({
  clearNotes: () => dispatch(clearNotes()),
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  setQuestionMelody: melody => dispatch(setQuestionMelody(melody)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  uploadQuestionMelody,
  loadQuestionMelody: () => loadQuestionMelody(dispatch),
  openSignInDialog: () => dispatch(openSignInDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
