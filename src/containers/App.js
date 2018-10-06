import { connect } from 'react-redux';

import { setUser, loadQuestionsList } from '../actions';
import App from '../components/App';

const mapStateToProps = state => ({
  mode: state.display.mode,
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  loadQuestionsList: () => loadQuestionsList(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
