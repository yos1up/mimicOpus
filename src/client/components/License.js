import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';


function License({ open, closeLicenseDialog }) {
  return (
    <Dialog open={open} onClose={() => closeLicenseDialog()}>
      <DialogTitle id="simple-dialog-title">ライセンス&クレジット</DialogTitle>
      <DialogContent>
        <Typography>
          yos1upとmarshiが頑張って開発したよ。
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
