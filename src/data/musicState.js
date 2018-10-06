import Immutable from 'immutable';

import Question from './question';

const MusicState = Immutable.Record({
  notes: Immutable.List(),
  pitchRange: [60, 72],
  question: new Question({}),
  questionsList: Immutable.Map(),
  bpm: 120,
  title: '',
});

export default MusicState;
