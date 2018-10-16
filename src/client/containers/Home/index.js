import { connect } from 'react-redux';

import {
  loadNewQuestionsList,
  setQuestion,
  changeDisplayMode,
  setBPM,
  setQuestionId,
} from '../../actions';

import Home from '../../components/Home';

const mapStateToProps = state => ({
  newQuestionsList: state.music.newQuestionsList,
});

const mapDispatchToProps = dispatch => ({
  loadNewQuestionsList: () => loadNewQuestionsList(dispatch),
  setQuestion: question => dispatch(setQuestion(question)),
  changeDisplayMode: mode => dispatch(changeDisplayMode(mode)),
  setBPM: bpm => dispatch(setBPM(bpm)),
  setQuestionId: questionId => dispatch(setQuestionId(questionId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);
