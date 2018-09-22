import React from 'react';
import ReactDOM from 'react-dom';

import PianoRollGrid from "./PianoRollGrid";
import Menu from "./Menu";
import scoreData from "./scoreData";


ReactDOM.render(
  <div>
    <div
      style={{
        position: "relative",
        left: 100,
        top: 100,
      }}
      >
      <PianoRollGrid pitchRange={[60, 72]} scoreData={scoreData}/>
    </div>
    <Menu/>
  </div>
  , document.getElementById('root'));
