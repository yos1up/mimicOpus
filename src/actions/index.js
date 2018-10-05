import actionTypes from './actionTypes';
import { functions } from '../firebase';
import Question from '../data/question';

// auth
export function openSignInDialog() {
  return {
    type: actionTypes.OPEN_SIGN_IN_DIALOG,
  };
}

export function closeSignInDialog() {
  return {
    type: actionTypes.CLOSE_SIGN_IN_DIALOG,
  };
}

export function setUid(uid) {
  return {
    type: actionTypes.SET_UID,
    uid,
  };
}

export function setUimage(uimage) {
  return {
    type: actionTypes.SET_UIMAGE,
    uimage,
  };
}

// display
export function changeDisplayMode(mode) {
  return {
    type: actionTypes.CHANGE_DISPLAY_MODE,
    mode,
  };
}

// music
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

export function setQuestion(question) {
  return {
    type: actionTypes.SET_QUESTION,
    question,
  };
}

export function setBPM(bpm) {
  return {
    type: actionTypes.SET_BPM,
    bpm,
  };
}

export function uploadQuestion(question) {
  functions.httpsCallable('uploadQuestion')(question.toJS()).then(
    () => {
    },
  );
}

export function addQuestionToList(id, question) {
  return {
    type: actionTypes.ADD_QUESTION_TO_LIST,
    id,
    question,
  };
}

export function loadQuestionsList(dispatch) {
  functions.httpsCallable('questionsList')().then(
    (result) => {
      const questionsList = result.data;
      questionsList.forEach((question) => {
        dispatch(addQuestionToList(question.id, Question.fromJS(question.data)));
      });
    },
  );
}
