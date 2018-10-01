import { connect } from 'react-redux';

import { closeSignInDialog, setUid } from '../actions';
import SignIn from '../components/SignIn';

const mapStateToProps = state => ({
  open: state.showSignIn,
});

const mapDispatchToProps = dispatch => ({
  closeSignInDialog: () => dispatch(closeSignInDialog()),
  setUid: uid => dispatch(setUid(uid)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
