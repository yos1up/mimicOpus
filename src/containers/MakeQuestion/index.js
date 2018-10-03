import { connect } from 'react-redux';

import {
  addNote, delNote, shiftPitchRange, setBPM,
} from '../../actions';
import MakeQuestion from '../../components/MakeQuestion';

const mapStateToProps = state => ({
  notes: state.music.notes,
  pitchRange: state.music.pitchRange,
  bpm: state.music.bpm,
});

const mapDispatchToProps = dispatch => ({
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
  setBPM: bpm => dispatch(setBPM(bpm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MakeQuestion);
