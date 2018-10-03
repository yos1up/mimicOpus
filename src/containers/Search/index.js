import { connect } from 'react-redux';

import {
  setQuestion,
  changeDisplayMode,
  setBPM,
} from '../../actions';
import Search from '../../components/Search';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
});

const mapDispatchToProps = dispatch => ({
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
