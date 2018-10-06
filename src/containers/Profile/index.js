import { connect } from 'react-redux';

import {

} from '../../actions';
import Profile from '../../components/Profile';

const mapStateToProps = state => ({
  user: state.auth.user,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
