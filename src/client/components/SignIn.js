import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import GoogleButton from 'react-google-button';


function SignIn({ open, closeSignInDialog }) {
  return (
    <Dialog open={open} onClose={() => closeSignInDialog()}>
      <DialogTitle id="simple-dialog-title">Sign In</DialogTitle>
      <DialogContent>
        <GoogleButton
          type="light"
          label="Googleでサインイン"
          onClick={() => {
            location.href = '/auth/google';
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

SignIn.propTypes = {
  open: PropTypes.bool.isRequired,
  closeSignInDialog: PropTypes.func.isRequired,
};

export default SignIn;
