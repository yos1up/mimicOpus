// import firebase from 'firebase';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';
import GradeIcon from '@material-ui/icons/Grade';
import ButtonBase from '@material-ui/core/ButtonBase';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';

import displayModes from '../../data/displayModes';


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
      mode, photoURL, uid, openSignInDialog, provider,
      openLicenseDialog, openFAQDialog, clearNotes,
    } = this.props;
    const { openUserMenu } = this.state;
    let modeText = '';
    switch (mode) {
      case displayModes.HOME:
        modeText = 'ホーム';
        break;
      case displayModes.MAKE_QUESTION:
        modeText = '問題を作成';
        break;
      case displayModes.PLAY_QUESTION:
        modeText = '問題を回答';
        break;
      case displayModes.SEARCH:
        modeText = '検索';
        break;
      case displayModes.USER:
        modeText = 'プロフィール';
        break;
      case displayModes.RANKING:
        modeText = 'ランキング';
        break;
      case displayModes.MAKE_EMBED_PIANO_ROLL:
        modeText = '埋め込みピアノロール';
        break;
      default:
        break;
    }
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
          {(photoURL !== null && photoURL !== undefined && photoURL !== '')
            ? (
              <ButtonBase
                buttonRef={(node) => { this.anchorEl = node; }}
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 5,
                }}
                onClick={() => this.handleOpenUserMenu()}
              >
                <Avatar
                  alt="no image"
                  src={photoURL}
                />
              </ButtonBase>
            ) : (
              <ButtonBase
                buttonRef={(node) => { this.anchorEl = node; }}
                style={{
                  position: 'absolute',
                  left: 5,
                  top: 5,
                }}
                onClick={() => this.handleOpenUserMenu()}
              >
                <Avatar
                  ref={(node) => { this.anchorEl = node; }}
                >
                  <AccountCircleIcon />
                </Avatar>
              </ButtonBase>
            )
          }
          <Drawer open={openUserMenu}>
            <Paper>
              <ClickAwayListener onClickAway={this.handleCloseUserMenu}>
                <MenuList>
                  <MenuItem
                    disabled={uid === -1}
                    onClick={() => {
                      this.handleCloseUserMenu();
                    }}
                    to="/user"
                    component={Link}
                  >
                    プロフィール
                  </MenuItem>
                  <MenuItem onClick={() => {
                    this.handleCloseUserMenu();
                    openSignInDialog();
                  }}
                  >
                    サインイン
                  </MenuItem>
                  <MenuItem onClick={() => {
                    this.handleCloseUserMenu();
                    openFAQDialog();
                  }}
                  >
                    FAQ（よくある質問）
                  </MenuItem>
                  <MenuItem onClick={() => {
                    this.handleCloseUserMenu();
                    openLicenseDialog();
                  }}
                  >
                    ライセンス&クレジット
                  </MenuItem>
                  <MenuItem
                    disabled={uid === -1}
                    onClick={() => {
                      this.handleCloseUserMenu();
                      location.href = '/auth/logout';
                    }}
                  >
                    ログアウト
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Drawer>
          <Typography
            style={{
              position: 'absolute',
              left: 60,
              top: 10,
              fontWeight: 'bold',
            }}
            variant="subtitle1"
          >
            {modeText}
          </Typography>
        </AppBar>
        <AppBar
          style={{
            position: 'fixed',
            left: 0,
            top: 48,
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
                || mode === displayModes.MAKE_QUESTION || mode === displayModes.RANKING
              ) ? mode : false}
              indicatorColor="primary"
              textColor="primary"
              style={{ float: 'left' }}
            >
              <Tab icon={<HomeIcon />} value={displayModes.HOME} to="/" component={Link} />
              <Tab icon={<SearchIcon />} value={displayModes.SEARCH} to="/search" component={Link} />
              <Tab icon={<EditIcon />} value={displayModes.MAKE_QUESTION} disabled={provider === 'anonymous'} to="/makequestion" component={Link} onClick={ () => clearNotes() } />
              <Tab icon={<GradeIcon />} value={displayModes.RANKING} to="/ranking" component={Link} />
              <Tab label="blog" onClick={() => { location.href = 'https://blog.mimicopus.com/'; }} />
            </Tabs>
          </div>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  mode: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
  openSignInDialog: PropTypes.func.isRequired,
};

export default Header;
