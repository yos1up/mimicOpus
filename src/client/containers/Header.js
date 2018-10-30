import { connect } from 'react-redux';

import {
  changeDisplayMode, openSignInDialog, openLicenseDialog,
} from '../actions';
import Header from '../components/Header';

const mapStateToProps = state => ({
  mode: state.display.mode,
  photoURL: state.auth.photoURL,
  provider: state.auth.provider,
  uid: state.auth.uid,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  openSignInDialog: () => dispatch(openSignInDialog()),
  openLicenseDialog: () => dispatch(openLicenseDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
