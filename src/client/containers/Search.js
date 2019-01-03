import { connect } from 'react-redux';

import {
  setQuestion,
  changeDisplayMode,
  setBPM,
  setNotes,
  setTitle,
  loadQuestionsList,
  setQuestionId,
  deleteUploadedQuestion,
  loadCountQuestions,
} from '../actions';
import Search from '../components/Search';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
  uid: state.auth.uid,
  lowBPM: state.search.lowBPM,
  highBPM: state.search.highBPM,
  searchTitle: state.search.searchTitle,
  searchUser: state.search.searchUser,
  countQuestions: state.search.countQuestions,
});

const mapDispatchToProps = dispatch => ({
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setNotes: notes => dispatch(setNotes(notes)),
  setTitle: title => dispatch(setTitle(title)),
  loadQuestionsList: (searchQuery, start, stop) => loadQuestionsList(
    dispatch, searchQuery, start, stop
  ),
  setQuestionId: questionId => dispatch(setQuestionId(questionId)),
  deleteUploadedQuestion,
  loadCountQuestions: searchQuery => loadCountQuestions(dispatch, searchQuery),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
