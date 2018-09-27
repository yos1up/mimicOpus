import { connect } from 'react-redux';

import {
  clearNotes,
  addNote,
  delNote,
} from '../actions';
import Menu from '../components/Menu';

const mapStateToProps = state => ({
  notes: state.notes,
});

const mapDispatchToProps = dispatch => ({
  clearNotes: () => dispatch(clearNotes()),
  addNote: note => dispatch(addNote(note)),
  delNote: idx => dispatch(delNote(idx)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);
