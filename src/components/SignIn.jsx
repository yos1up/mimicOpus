import firebase from 'firebase';
import React from 'react';
import PropTypes from 'prop-types';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';


function SignIn({ open, closeSignInDialog }) {
  // TODO: エラー処理
  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/signedIn',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => {
        closeSignInDialog();
      },
    },
  };
  return (
    <Dialog open={open} onClose={() => closeSignInDialog()}>
      <DialogTitle id="simple-dialog-title">Sign In</DialogTitle>
      <DialogContent>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </DialogContent>
    </Dialog>
  );
}

SignIn.propTypes = {
  open: PropTypes.bool.isRequired,
  closeSignInDialog: PropTypes.func.isRequired,
};

export default SignIn;
