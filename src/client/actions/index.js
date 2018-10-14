import actionTypes from './actionTypes';
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

export function changeUsername(dispatch, name) {
  /* firebase.auth().currentUser.updateProfile({
    username: name,
  }).then(() => {
    dispatch(setUser(firebase.auth().currentUser));
  }); */
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
  /* const data = question.toJS();
  data.uploadedAt = firebase.firestore.Timestamp.now();
  data.uid = firebase.auth().currentUser.uid;
  questionsRef
    .doc(questionId)
    .set(data); */
}

export function deleteUploadedQuestion(questionId) {
  const method = 'POST';
  const body = JSON.stringify({ id: questionId });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/deleteQuestion', { method, headers, body })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
}

export function uploadQuestion(question) {
  const obj = question.toJS();
  const method = 'POST';
  const body = JSON.stringify(obj);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/uploadQuestion', { method, headers, body })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
}

export function loadQuestionsList(dispatch, lowBPM = 0, highBPM = 1000) {
  dispatch(clearQuestionsList());

  const method = 'GET';
  const params = new URLSearchParams();
  params.set('lowBPM', lowBPM);
  params.set('highBPM', highBPM);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      Object.keys(results).forEach((key) => {
        dispatch(addQuestionToList(key, Question.fromJS(results[key])));
      });
    })
    .catch(console.error);
}

export function saveScore(qid, score) {
  const method = 'POST';
  const body = JSON.stringify({ qid, uid: 0, score });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/saveScore', { method, headers, body })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
}

export function setUsername(username) {
  return {
    type: actionTypes.SET_USERNAME,
    username,
  };
}

export function setPhotoURL(photoURL) {
  return {
    type: actionTypes.SET_PHOTO_URL,
    photoURL,
  };
}

export function setUid(uid) {
  return {
    type: actionTypes.SET_UID,
    uid,
  };
}

export function loadMe(dispatch) {
  fetch('./api/getMe', { method: 'GET' })
    .then(res => res.json())
    .then((results) => {
      if (results.id !== -1) {
        dispatch(setUsername(results.username));
        dispatch(setPhotoURL(results.photoURL));
        dispatch(setUid(results.id));
      } else {
        fetch('./auth/anonymous', { method: 'GET' });
        dispatch(setUsername('anonymous'));
        dispatch(setPhotoURL(''));
        dispatch(setUid(-1));
      }
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
