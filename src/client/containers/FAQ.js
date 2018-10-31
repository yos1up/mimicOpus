import { connect } from 'react-redux';

import { closeFAQDialog } from '../actions';
import FAQ from '../components/FAQ';

const mapStateToProps = state => ({
  open: state.display.showFAQ,
});

const mapDispatchToProps = dispatch => ({
  closeFAQDialog: () => dispatch(closeFAQDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FAQ);
