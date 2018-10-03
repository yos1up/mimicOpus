import Immutable from 'immutable';


const MusicState = Immutable.Record({
  notes: Immutable.List(),
  pitchRange: [60, 72],
  questionMelody: Immutable.List(),
  questionsList: Immutable.List(),
  bpm: 120,
});

export default MusicState;
