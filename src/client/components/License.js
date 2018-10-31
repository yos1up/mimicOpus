import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';


function License({ open, closeLicenseDialog }) {
  return (
    <Dialog open={open} onClose={() => closeLicenseDialog()}>
      <DialogContent>
        <Typography variant="h7">
          This service is developed by
        </Typography>
        <Typography variant="h7">
          Yuki Yoshida (yos1up) & Masashi Yoshikawa (marshi)
        </Typography>
        <br />
        <Typography variant="h7">
          This service is released under the MIT License.
        </Typography>
        <br />
        <Typography variant="h6">
          Piano Sound
        </Typography>
        <Typography variant="body1">
          University of Iowa Electronic Music Studios
          (http://theremin.music.uiowa.edu/MISpiano.html)
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

License.propTypes = {
  open: PropTypes.bool.isRequired,
  closeLicenseDialog: PropTypes.func.isRequired,
};

export default License;
