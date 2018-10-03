import { connect } from 'react-redux';

import {
  addNote, delNote, shiftPitchRange, setBPM, uploadQuestionMelody, loadQuestionMelody,
} from '../../actions';
import PlayQuestion from '../../components/PlayQuestion';

const mapStateToProps = state => ({
  notes: state.music.notes,
  questionMelody: state.music.questionMelody,
  pitchRange: state.music.pitchRange,
  bpm: state.music.bpm,
});

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  uploadQuestionMelody,
  loadQuestionMelody: () => loadQuestionMelody(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayQuestion);
