import Immutable from 'immutable';

import actionTypes from '../actions/actionTypes';
import MusicState from '../data/musicState';


export default function (state = new MusicState(), action) {
  switch (action.type) {
    case actionTypes.CLEAR_NOTES:
      return state.set('notes', Immutable.List());

    case actionTypes.ADD_NOTE:
      return state.update('notes', notes => notes.push(action.note));

    case actionTypes.DEL_NOTE:
      return state.update('notes', notes => notes.delete(action.idx));

    case actionTypes.SET_NOTES:
      return state.set('notes', action.notes);

    case actionTypes.SHIFT_PITCH_RANGE: {
      let newPitchRange = [state.pitchRange[0] + action.delta,
        state.pitchRange[1] + action.delta];
      if (newPitchRange[0] < 0) {
        newPitchRange = [0, newPitchRange[1] - newPitchRange[0]];
      } else if (newPitchRange[1] > 127) {
        newPitchRange = [127 - newPitchRange[1] + newPitchRange[0], 127];
      }
      return state.set('pitchRange', newPitchRange);
    }

    case actionTypes.SET_QUESTION:
      return state.set('question', action.question);

    case actionTypes.SET_BPM:
      return state.set('bpm', action.bpm);

    case actionTypes.SET_TITLE:
      return state.set('title', action.title);

    case actionTypes.SET_QUESTION_ID:
      return state.set('questionId', action.questionId);

    case actionTypes.ADD_QUESTION_TO_LIST:
      return state.update('questionsList', ql => ql.push({ id: action.id, question: action.question }));

    case actionTypes.CLEAR_QUESTIONS_LIST:
      return state.set('questionsList', Immutable.List());

    case actionTypes.ADD_QUESTION_TO_NEW_LIST:
      return state.update('newQuestionsList', ql => ql.push({ id: action.id, question: action.question }));

    case actionTypes.CLEAR_NEW_QUESTIONS_LIST:
      return state.set('newQuestionsList', Immutable.List());

    case actionTypes.ADD_QUESTION_TO_OSUSUME_LIST:
      return state.update('osusumeQuestionsList', ql => ql.push({ id: action.id, question: action.question }));

    case actionTypes.CLEAR_OSUSUME_QUESTIONS_LIST:
      return state.set('osusumeQuestionsList', Immutable.List());

    case actionTypes.OPEN_SCORE_DIALOG:
      return state.set('isOpenScoreDialog', true).set('textScoreDialog', action.text);

    case actionTypes.CLOSE_SCORE_DIALOG:
      return state.set('isOpenScoreDialog', false);

    default:
      return state;
  }
}
