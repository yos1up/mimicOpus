import { connect } from 'react-redux';

import {
  changeDisplayMode, openSignInDialog, openLicenseDialog, openFAQDialog, clearNotes, setBPM,
} from '../../actions';
import MobileHeader from '../../components/Mobile/Header';

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
  openFAQDialog: () => dispatch(openFAQDialog()),
  clearNotes: () => dispatch(clearNotes()),
  setBPM: bpm => dispatch(setBPM(bpm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MobileHeader);
