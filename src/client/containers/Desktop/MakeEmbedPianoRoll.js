import { connect } from 'react-redux';

import {
  changeDisplayMode,
} from '../../actions';
import PlayQuestion from '../../components/Desktop/MakeEmbedPianoRoll';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayQuestion);
