import { connect } from "react-redux";

import { clearNotes, addNote, delNote } from "../actions";
import PianoRollGrid from "../components/PianoRollGrid";

const mapStateToProps = (state) => ({
  notes: state.notes,
});

const mapDispatchToProps = (dispatch) => ({
  clearNotes: () => dispatch(clearNotes()),
  addNote: (note) => dispatch(addNote(note)),
  delNote: (idx) => dispatch(delNote(idx)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PianoRollGrid);
