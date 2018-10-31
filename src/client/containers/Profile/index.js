import { connect } from 'react-redux';

import {
  changeDisplayName,
} from '../../actions';
import Profile from '../../components/Profile';

const mapStateToProps = state => ({
  photoURL: state.auth.photoURL,
  displayName: state.auth.displayName,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayName: name => changeDisplayName(dispatch, name),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
