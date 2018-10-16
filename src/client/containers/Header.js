import { connect } from 'react-redux';

import {
  changeDisplayMode, openSignInDialog, openLisenceDialog,
} from '../actions';
import Header from '../components/Header';

const mapStateToProps = state => ({
  mode: state.display.mode,
  photoURL: state.auth.photoURL,
  provider: state.auth.provider,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  openSignInDialog: () => dispatch(openSignInDialog()),
  openLisenceDialog: () => dispatch(openLisenceDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
