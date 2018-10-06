import { connect } from 'react-redux';

import {

} from '../../actions';
import Profile from '../../components/Profile';

const mapStateToProps = state => ({
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
