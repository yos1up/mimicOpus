import actionTypes from './actionTypes';
import { db } from '../firebase';

const questionsRef = db.collection('questions');

// Notes
export function clearNotes() {
  return {
    type: actionTypes.CLEAR_NOTES,
  };
}

export function addNote(note) {
  return {
    type: actionTypes.ADD_NOTE,
    note,
  };
}

export function delNote(idx) {
  return {
    type: actionTypes.DEL_NOTE,
    idx,
  };
}

export function shiftPitchRange(delta) {
  return {
    type: actionTypes.SHIFT_PITCH_RANGE,
    delta,
  };
}

export function setQuestionMelody(melody) {
  return {
    type: actionTypes.SET_QUESTION_MELODY,
    melody,
  };
}

export function uploadQuestionMelody(melody) {
  return questionsRef.doc('test').set({
    melody,
  });
}

export function loadQuestionMelody(dispatch) {
  questionsRef.doc('test').get().then((doc) => {
    if (doc.exists) {
      dispatch(setQuestionMelody(doc.data().melody));
      // console.log('Document data:', doc.data());
    } else {
      // doc.data() will be undefined in this case
      // console.log('No such document!');
    }
  });
}
