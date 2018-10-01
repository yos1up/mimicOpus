import { connect } from 'react-redux';

import { setUid, setUimage } from '../actions';
import App from '../components/App';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  setUid: uid => dispatch(setUid(uid)),
  setUimage: uimage => dispatch(setUimage(uimage)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
