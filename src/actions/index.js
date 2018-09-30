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
  return questionsRef.add({
    melody,
    uploadedAt: new Date(),
  });
}

export function loadQuestionMelody(dispatch) {
  // 件数のチェック
  // questionsRef.get().then((qss) => { console.log(`#records: ${qss.size}`); });

  // 最新の一件を取得
  questionsRef.orderBy('uploadedAt', 'desc').limit(1).get().then(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        dispatch(setQuestionMelody(doc.data().melody));
      });
    },
  );
}
