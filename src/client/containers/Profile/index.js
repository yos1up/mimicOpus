import { connect } from 'react-redux';

import {
  changeUsername,
} from '../../actions';
import Profile from '../../components/Profile';

const mapStateToProps = state => ({
  photoURL: state.auth.photoURL,
  username: state.auth.username,
});

const mapDispatchToProps = dispatch => ({
  changeUsername: name => changeUsername(dispatch, name),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
