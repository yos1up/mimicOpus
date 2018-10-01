import { connect } from 'react-redux';

import { closeSignInDialog } from '../actions';
import SignIn from '../components/SignIn';

const mapStateToProps = state => ({
  open: state.showSignIn,
});

const mapDispatchToProps = dispatch => ({
  closeSignInDialog: () => dispatch(closeSignInDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SignIn);
