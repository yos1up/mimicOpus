import { connect } from 'react-redux';

import {
  changeDisplayMode, openSignInDialog,
} from '../actions';
import Header from '../components/Header';

const mapStateToProps = state => ({
  mode: state.display.mode,
  uimage: state.auth.uimage,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  openSignInDialog: () => dispatch(openSignInDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
