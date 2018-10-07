import firebase from 'firebase';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ButtonBase from '@material-ui/core/ButtonBase';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import displayModes from '../data/displayModes';


class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = { openUserMenu: false };
    this.handleOpenUserMenu = this.handleOpenUserMenu.bind(this);
    this.handleCloseUserMenu = this.handleCloseUserMenu.bind(this);
  }

  handleOpenUserMenu() {
    this.setState({ openUserMenu: true });
  }

  handleCloseUserMenu() {
    this.setState({ openUserMenu: false });
  }

  render() {
    const {
      mode, photoURL, changeDisplayMode, openSignInDialog,
    } = this.props;
    const { openUserMenu } = this.state;
    return (
      <div id="Header">
        <AppBar
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: 48,
            zIndex: 10,
            backgroundColor: '#ffffff',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 1000,
              margin: '0px auto',
              top: 0,
            }}
          >
            <Tabs
              value={(mode === displayModes.HOME || mode === displayModes.SEARCH
                || mode === displayModes.MAKE_QUESTION) ? mode : false}
              onChange={(e, v) => changeDisplayMode(v)}
              indicatorColor="primary"
              textColor="primary"
              style={{ float: 'left' }}
            >
              <Tab label="ホーム" value={displayModes.HOME} />
              <Tab label="検索" value={displayModes.SEARCH} />
              <Tab label="問題を作る" value={displayModes.MAKE_QUESTION} />
            </Tabs>
            {(photoURL !== null && photoURL !== undefined && photoURL !== '')
              ? (
                <ButtonBase
                  buttonRef={(node) => { this.anchorEl = node; }}
                  style={{ float: 'right', top: 5 }}
                >
                  <Avatar
                    alt="no image"
                    src={photoURL}
                    onClick={() => this.handleOpenUserMenu()}
                  />
                </ButtonBase>
              ) : (
                <ButtonBase
                  buttonRef={(node) => { this.anchorEl = node; }}
                  style={{ float: 'right', top: 5 }}
                >
                  <Avatar
                    ref={(node) => { this.anchorEl = node; }}
                    onClick={() => this.handleOpenUserMenu()}
                  >
                    <AccountCircleIcon />
                  </Avatar>
                </ButtonBase>
              )
            }
            <Popper open={openUserMenu} anchorEl={this.anchorEl} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={this.handleCloseUserMenu}>
                      <MenuList>
                        <MenuItem onClick={() => {
                          this.handleCloseUserMenu();
                          changeDisplayMode(displayModes.USER);
                        }}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem onClick={() => {
                          this.handleCloseUserMenu();
                          openSignInDialog();
                        }}
                        >
                          Signin
                        </MenuItem>
                        <MenuItem onClick={() => {
                          this.handleCloseUserMenu();
                          // エラー処理
                          firebase.auth().signOut();
                        }}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  mode: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
  openSignInDialog: PropTypes.func.isRequired,
};

export default Header;
