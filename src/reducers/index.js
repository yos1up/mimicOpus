import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';

export default function (state = {
  notes: Immutable.List(), pitchRange: [60, 72], questionMelody: Immutable.List(),
}, action) {
  switch (action.type) {
    case actionTypes.CLEAR_NOTES:
      return {
        notes: Immutable.List(),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
      };

    case actionTypes.ADD_NOTE:
      return {
        notes: state.notes.push(action.note),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
      };

    case actionTypes.DEL_NOTE:
      return {
        notes: state.notes.delete(action.idx),
        pitchRange: state.pitchRange,
        questionMelody: state.questionMelody,
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
      };
    }

    case actionTypes.SET_QUESTION_MELODY:
      return {
        notes: state.notes,
        pitchRange: state.pitchRange,
        questionMelody: Immutable.List(action.melody),
      };

    default:
      return state;
  }
}
