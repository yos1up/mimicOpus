import React from 'react';

import PianoRollGrid from '../containers/PianoRollGrid';
import Menu from '../containers/Menu';
import SignIn from '../containers/SignIn';

function App() {
  return (
    <div
      style={{
        position: 'relative',
        margin: '0px auto',
        width: 850,
        height: 350,
      }}
    >
      <Menu />
      <PianoRollGrid pitchRange={[60, 72]} />
      <SignIn />
    </div>
  );
}

export default App;
