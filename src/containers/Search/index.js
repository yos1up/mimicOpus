import { connect } from 'react-redux';

import {
  setQuestion,
  changeDisplayMode,
  setBPM,
  setLowBPM,
  setHighBPM,
} from '../../actions';
import Search from '../../components/Search';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
  lowBPM: state.search.lowBPM,
  highBPM: state.search.highBPM,
});

const mapDispatchToProps = dispatch => ({
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setLowBPM: bpm => dispatch(setLowBPM(bpm)),
  setHighBPM: bpm => dispatch(setHighBPM(bpm)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
