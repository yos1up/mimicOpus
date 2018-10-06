import firebase from 'firebase';
import React from 'react';
import PropTypes from 'prop-types';

function Profile(props) {
  const { user } = props;
  return (
    <div>
      <img
        alt="画像なし"
        src={user.photoURL}
      />
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.instanceOf(firebase.User).isRequired,
};

export default Profile;
