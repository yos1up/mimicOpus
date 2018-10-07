import { connect } from 'react-redux';

import {
  changeDisplayMode, openSignInDialog,
} from '../actions';
import Header from '../components/Header';

const mapStateToProps = state => ({
  mode: state.display.mode,
  photoURL: state.auth.photoURL,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  openSignInDialog: () => dispatch(openSignInDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
