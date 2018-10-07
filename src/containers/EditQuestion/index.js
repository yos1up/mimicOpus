import { connect } from 'react-redux';

import {
  addNote, delNote, shiftPitchRange, setBPM, changeUploadedQuestion, setTitle,
} from '../../actions';
import EditQuestion from '../../components/EditQuestion';

const mapStateToProps = state => ({
  notes: state.music.notes,
  pitchRange: state.music.pitchRange,
  bpm: state.music.bpm,
  title: state.music.title,
  questionId: state.music.questionId,
});

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setTitle: title => dispatch(setTitle(title)),
  changeUploadedQuestion,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditQuestion);
