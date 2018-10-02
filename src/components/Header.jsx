import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import PropTypes from 'prop-types';

import { displayModes } from '../reducers/display';


function Header({
  mode, changeDisplayMode,
}) {
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
            value={mode}
            onChange={(e, v) => changeDisplayMode(v)}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="問題を作る" value={displayModes.MAKE_QUESTION} />
            <Tab label="問題を解く" value={displayModes.PLAY_QUESTION} />
            <Tab label="検索" value={displayModes.SEARCH} />
            <Tab label="ユーザー" value={displayModes.onMouseEnter} />
          </Tabs>
        </div>
      </AppBar>
    </div>
  );
}

Header.propTypes = {
  mode: PropTypes.string.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default Header;
