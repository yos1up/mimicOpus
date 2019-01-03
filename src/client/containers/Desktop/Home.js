import { connect } from 'react-redux';

import {
  loadNewQuestionsList,
  loadOsusumeQuestionsList,
  setQuestion,
  changeDisplayMode,
  setBPM,
  setQuestionId,
} from '../../actions';

import Home from '../../components/Desktop/Home';

const mapStateToProps = state => ({
  newQuestionsList: state.music.newQuestionsList,
  osusumeQuestionsList: state.music.osusumeQuestionsList,
});

const mapDispatchToProps = dispatch => ({
  loadNewQuestionsList: () => loadNewQuestionsList(dispatch),
  loadOsusumeQuestionsList: () => loadOsusumeQuestionsList(dispatch),
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setQuestionId: questionId => dispatch(setQuestionId(questionId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
