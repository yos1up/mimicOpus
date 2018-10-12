import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editUserName: false };
  }

  render() {
    const { photoURL, displayName, changeDisplayName } = this.props;
    const { editUserName } = this.state;
    const avatarStyle = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 200,
      height: 200,
    };
    return (
      <div>
        {(photoURL !== null && photoURL !== undefined && photoURL !== '')
          ? (
            <Avatar
              alt="no image"
              src={photoURL}
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
        {(editUserName) ? (
          <Input
            defaultValue={displayName}
            inputProps={{
              'aria-label': 'Description',
            }}
            style={{
              position: 'absolute', top: 210, left: 10, height: 40, width: 180,
            }}
            onBlur={(e) => {
              changeDisplayName(e.target.value);
              this.setState({ editUserName: false });
            }}
          />
        ) : (
          <Typography
            variant="display1"
            style={{
              position: 'absolute', top: 210, left: 10, width: 180,
            }}
            onClick={() => {
              this.setState({ editUserName: true });
            }}
          >
            {displayName}
          </Typography>
        )}
      </div>
    );
  }
}

Profile.propTypes = {
  photoURL: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
};

export default Profile;
