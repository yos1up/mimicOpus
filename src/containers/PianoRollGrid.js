import { connect } from 'react-redux';

import {
  clearNotes, addNote, delNote, shiftPitchRange,
} from '../actions';
import PianoRollGrid from '../components/PianoRollGrid';

const mapStateToProps = state => ({
  notes: state.music.notes,
  pitchRange: state.music.pitchRange,
});

const mapDispatchToProps = dispatch => ({
  clearNotes: () => dispatch(clearNotes()),
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
  shiftPitchRange: delta => dispatch(shiftPitchRange(delta)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PianoRollGrid);
