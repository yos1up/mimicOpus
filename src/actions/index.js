import firebase from 'firebase';

import actionTypes from './actionTypes';
import { db, functions } from '../firebase';
import Question from '../data/question';

const scoresRef = db.collection('scores');
const questionsRef = db.collection('questions');

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

export function setUser(user) {
  return {
    type: actionTypes.SET_USER,
    user,
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

export function setNotes(notes) {
  return {
    type: actionTypes.SET_NOTES,
    notes,
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

export function setTitle(title) {
  return {
    type: actionTypes.SET_TITLE,
    title,
  };
}

export function setQuestionId(questionId) {
  return {
    type: actionTypes.SET_QUESTION_ID,
    questionId,
  };
}

export function addQuestionToList(id, question) {
  return {
    type: actionTypes.ADD_QUESTION_TO_LIST,
    id,
    question,
  };
}

export function clearQuestionsList() {
  return {
    type: actionTypes.CLEAR_QUESTIONS_LIST,
  };
}

export function changeUploadedQuestion(questionId, question) {
  const data = question.toJS();
  data.uploadedAt = firebase.firestore.Timestamp.now();
  data.uid = firebase.auth().currentUser.uid;
  questionsRef
    .doc(questionId)
    .set(data);
}

export function deleteUploadedQuestion(questionId) {
  questionsRef
    .doc(questionId)
    .delete();
}

export function uploadQuestion(question) {
  functions.httpsCallable('uploadQuestion')(question.toJS()).then(
    () => {
    },
  );
}

export function loadQuestionsList(dispatch, lowBPM = 0, highBPM = 1000) {
  dispatch(clearQuestionsList());
  functions.httpsCallable('questionsList')({ lowBPM, highBPM }).then(
    (result) => {
      const questionsList = result.data;
      questionsList.forEach((question) => {
        dispatch(addQuestionToList(question.id, Question.fromJS(question.data)));
      });
    },
  );
}

export function saveScore(questionId, score) {
  scoresRef.add({
    questionId,
    uid: firebase.auth().currentUser.uid,
    score,
  });
}

// search
export function setLowBPM(bpm) {
  return {
    type: actionTypes.SET_LOW_BPM,
    bpm,
  };
}

export function setHighBPM(bpm) {
  return {
    type: actionTypes.SET_HIGH_BPM,
    bpm,
  };
}
