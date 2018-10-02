import { connect } from 'react-redux';

import {
  changeDisplayMode,
} from '../actions';
import Header from '../components/Header';

const mapStateToProps = state => ({
  mode: state.display.mode,
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
