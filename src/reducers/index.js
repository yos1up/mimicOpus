import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';

// TODO: separate reducers ?? (for Menu and PianoRollGrid)
export default function (state = {
  notes: Immutable.List(), pitchRange: [60, 72], questionMelody: Immutable.List(), bpm: 120,
}, action) {
  switch (action.type) {
    case actionTypes.CLEAR_NOTES:
      return {
        notes: Immutable.List(),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
        bpm: state.bpm,
      };

    case actionTypes.ADD_NOTE:
      return {
        notes: state.notes.push(action.note),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
        bpm: state.bpm,
      };

    case actionTypes.DEL_NOTE:
      return {
        notes: state.notes.delete(action.idx),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
        bpm: state.bpm,
      };

    case actionTypes.SHIFT_PITCH_RANGE: {
      let newPitchRange = [state.pitchRange[0] + action.delta,
        state.pitchRange[1] + action.delta];
      if (newPitchRange[0] < 0) {
        newPitchRange = [0, newPitchRange[1] - newPitchRange[0]];
      } else if (newPitchRange[1] > 127) {
        newPitchRange = [127 - newPitchRange[1] + newPitchRange[0], 127];
      }
      return {
        notes: state.notes,
        pitchRange: newPitchRange,
        questionMelody: state.questionMelody,
        bpm: state.bpm,
      };
    }

    case actionTypes.SET_QUESTION_MELODY:
      return {
        notes: state.notes,
        pitchRange: state.pitchRange,
        questionMelody: Immutable.List(action.melody),
        bpm: state.bpm,
      };

    case actionTypes.SET_BPM:
      return {
        notes: state.notes,
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
        bpm: action.bpm,
      };

    default:
      return state;
  }
}
