import { connect } from 'react-redux';

import { setUserInfo, loadQuestionsList } from '../actions';
import App from '../components/App';

const mapStateToProps = state => ({
  mode: state.display.mode,
});

const mapDispatchToProps = dispatch => ({
  setUserInfo: userInfo => dispatch(setUserInfo(userInfo)),
  loadQuestionsList: () => loadQuestionsList(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
