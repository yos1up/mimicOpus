import { connect } from 'react-redux';

import {
  changeDisplayName, changeDisplayMode,
} from '../../actions';
import Profile from '../../components/Desktop/Profile';

const mapStateToProps = state => ({
  photoURL: state.auth.photoURL,
  displayName: state.auth.displayName,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayName: name => changeDisplayName(dispatch, name),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
