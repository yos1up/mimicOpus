import actionTypes from './actionTypes';
import { db, functions } from '../firebase';
import Question from '../data/question';

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
  return questionsRef.add(question.toJS());
}

export function loadQuestion(dispatch) {
  // 件数のチェック
  // questionsRef.get().then((qss) => { console.log(`#records: ${qss.size}`); });

  // 最新の一件を取得
  questionsRef.orderBy('uploadedAt', 'desc').limit(1).get().then(
    (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        dispatch(setQuestion(Question.fromJS(doc.data())));
        dispatch(setBPM(doc.data().bpm));
      });
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
      const { questionsList } = result.data;
      questionsList.forEach((question) => {
        dispatch(addQuestionToList(question.id, Question.fromJS(question.data)));
      });
    },
  );
}
