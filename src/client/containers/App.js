import { connect } from 'react-redux';

import { loadMe } from '../actions';
import App from '../components/App';

const mapStateToProps = state => ({
  mode: state.display.mode,
});

const mapDispatchToProps = dispatch => ({
  loadMe: () => loadMe(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
