import { connect } from 'react-redux';

import { setUid, setUimage, loadQuestionsList } from '../actions';
import App from '../components/App';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setUid: uid => dispatch(setUid(uid)),
  setUimage: uimage => dispatch(setUimage(uimage)),
  loadQuestionsList: () => loadQuestionsList(dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
