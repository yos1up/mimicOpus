import { connect } from 'react-redux';

import {
  setQuestion,
  changeDisplayMode,
  setBPM,
  setNotes,
  setTitle,
  setLowBPM,
  setHighBPM,
  loadQuestionsList,
  setQuestionId,
  deleteUploadedQuestion,
} from '../../actions';
import Search from '../../components/Search';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
  uid: state.auth.uid,
  lowBPM: state.search.lowBPM,
  highBPM: state.search.highBPM,
});

const mapDispatchToProps = dispatch => ({
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setNotes: notes => dispatch(setNotes(notes)),
  setTitle: title => dispatch(setTitle(title)),
  setLowBPM: bpm => dispatch(setLowBPM(bpm)),
  setHighBPM: bpm => dispatch(setHighBPM(bpm)),
  loadQuestionsList: (lowBPM, highBPM) => loadQuestionsList(dispatch, lowBPM, highBPM),
  setQuestionId: questionId => dispatch(setQuestionId(questionId)),
  deleteUploadedQuestion,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
