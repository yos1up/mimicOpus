import { connect } from 'react-redux';

import {

} from '../../actions';
import Search from '../../components/Search';

const mapStateToProps = state => ({
  questionsList: state.music.questionsList,
});

const mapDispatchToProps = (/* dispatch */) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
