import firebase from 'firebase';
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';

function Profile(props) {
  const { user } = props;
  const avatarStyle = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 200,
    height: 200,
  };
  return (
    <div>
      {(user.photoURL !== null && user.photoURL !== undefined && user.photoURL !== '')
        ? (
          <Avatar
            alt="no image"
            src={user.photoURL}
            style={avatarStyle}
          />
        ) : (
          <Avatar
            style={avatarStyle}
          >
            <AccountCircleIcon />
          </Avatar>
        )
      }
      <Typography
        variant="display1"
        style={{
          position: 'absolute', top: 210, left: 10, width: 180,
        }}
      >
        {user.displayName}
      </Typography>
    </div>
  );
}

Profile.propTypes = {
  user: PropTypes.instanceOf(firebase.User).isRequired,
};

export default Profile;
