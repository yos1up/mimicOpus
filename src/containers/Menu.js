import { connect } from 'react-redux';

import {
  clearNotes,
  addNote,
  delNote,
  setQuestionMelody,
  uploadQuestionMelody,
  loadQuestionMelody,
} from '../actions';
import Menu from '../components/Menu';

const mapStateToProps = state => ({
  notes: state.notes,
  questionMelody: state.questionMelody,
});

const mapDispatchToProps = dispatch => ({
  clearNotes: () => dispatch(clearNotes()),
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  setQuestionMelody: melody => dispatch(setQuestionMelody(melody)),
  uploadQuestionMelody,
  loadQuestionMelody: () => loadQuestionMelody(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
