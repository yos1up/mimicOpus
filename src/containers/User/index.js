import { connect } from 'react-redux';

import {

} from '../../actions';
import User from '../../components/User';

const mapStateToProps = state => ({
  uimage: state.auth.uimage,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(User);
