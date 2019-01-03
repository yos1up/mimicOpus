import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { Helmet } from 'react-helmet';

import displayModes from '../../data/displayModes';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tempDisplayName: props.displayName,
      width: null,
      height: null,
    };
  }

  componentDidMount() {
    const { changeDisplayMode } = this.props;
    changeDisplayMode(displayModes.USER);
  }

  render() {
    const { photoURL, changeDisplayName } = this.props;
    const { tempDisplayName } = this.state;
    return (
      <div
        id="Profile"
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
        }}
        ref={(element) => {
          const { width: width_, height: height_ } = this.state;
          this.element = element;
          if (this.element !== null
            && (this.element.offsetWidth !== width_
            || this.element.offsetHeight !== height_)) {
            this.setState({
              width: this.element.offsetWidth,
              height: this.element.offsetHeight,
            });
          }
        }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>ユーザー - mimicOpus</title>
        </Helmet>
        {(photoURL !== null && photoURL !== undefined && photoURL !== '')
          ? (
            <Avatar
              alt="no image"
              src={photoURL}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 100,
                height: 100,
              }}
            />
          ) : (
            <Avatar
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 100,
                height: 100,
              }}
            >
              <AccountCircleIcon />
            </Avatar>
          )
        }
        <Input
          value={tempDisplayName}
          inputProps={{
            'aria-label': 'Description',
          }}
          style={{
            position: 'absolute', top: 110, left: 10, height: 40, width: 180,
          }}
          onChange={e => this.setState({ tempDisplayName: e.target.value })}
        />
        <Button
          variant="contained"
          color="primary"
          style={{
            position: 'absolute', top: 210, left: 10, height: 40, width: 120,
          }}
          onClick={() => {
            changeDisplayName(tempDisplayName);
          }}
        >
          変更
        </Button>
      </div>
    );
  }
}

Profile.propTypes = {
  photoURL: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  changeDisplayName: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default Profile;
