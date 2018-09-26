import React from 'react';

import PianoRollGrid from '../containers/PianoRollGrid';
import Menu from '../containers/Menu';

function App() {
  return (
    <div>
      <div
        style={{
          position: 'relative',
          left: 100,
          top: 100,
        }}
      >
        <PianoRollGrid pitchRange={[60, 72]} />
      </div>
      <Menu />
    </div>
  );
}

export default App;
