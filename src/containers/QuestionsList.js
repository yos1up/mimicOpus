import { connect } from 'react-redux';

import {} from '../actions';
import QuestionsList from '../components/QuestionsList';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestionsList);
