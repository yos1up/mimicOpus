import { connect } from 'react-redux';

import { closeLisenceDialog } from '../actions';
import Lisence from '../components/Lisence';

const mapStateToProps = state => ({
  open: state.display.showLisence,
});

const mapDispatchToProps = dispatch => ({
  closeLisenceDialog: () => dispatch(closeLisenceDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Lisence);
