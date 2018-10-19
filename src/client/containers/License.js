import { connect } from 'react-redux';

import { closeLicenseDialog } from '../actions';
import License from '../components/License';

const mapStateToProps = state => ({
  open: state.display.showLicense,
});

const mapDispatchToProps = dispatch => ({
  closeLicenseDialog: () => dispatch(closeLicenseDialog()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(License);
