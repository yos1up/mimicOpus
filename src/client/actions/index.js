import actionTypes from './actionTypes';
import Question from '../data/question';

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

export function openLicenseDialog() {
  return {
    type: actionTypes.OPEN_LICENSE_DIALOG,
  };
}

export function closeLicenseDialog() {
  return {
    type: actionTypes.CLOSE_LICENSE_DIALOG,
  };
}

export function changeDisplayMode(mode) {
  return {
    type: actionTypes.CHANGE_DISPLAY_MODE,
    mode,
  };
}

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
  const obj = question.toJS();
  obj.id = questionId;
  const method = 'POST';
  const body = JSON.stringify(obj);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/changeQuestion', { method, headers, body })
    .then(res => res.json())
    .then(console.log)
    .catch(console.error);
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

export function loadQuestionsList(dispatch, lowBPM = 0, highBPM = 1000, start = 1, stop = 10, title = '', user = '') {
  dispatch(clearQuestionsList());

  const method = 'GET';
  const params = new URLSearchParams();
  params.set('lowBPM', lowBPM);
  params.set('highBPM', highBPM);
  params.set('start', start);
  params.set('stop', stop);
  params.set('title', title);
  params.set('user', user);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.forEach((item) => {
        dispatch(addQuestionToList(item.id, Question.fromJS(item.question)));
      });
    })
    .catch(console.error);
}

export function addQuestionToNewList(id, question) {
  return {
    type: actionTypes.ADD_QUESTION_TO_NEW_LIST,
    id,
    question,
  };
}

export function clearNewQuestionsList() {
  return {
    type: actionTypes.CLEAR_NEW_QUESTIONS_LIST,
  };
}

export function loadNewQuestionsList(dispatch) {
  dispatch(clearNewQuestionsList());
  const method = 'GET';
  const params = new URLSearchParams();
  params.set('start', 1);
  params.set('stop', 4);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.forEach((item) => {
        dispatch(addQuestionToNewList(item.id, Question.fromJS(item.question)));
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

export function setProvider(provider) {
  return {
    type: actionTypes.SET_PROVIDER,
    provider,
  };
}

export function setBInvalidUsername(bInvalidUsername) {
  return {
    type: actionTypes.SET_B_INVALID_USERNAME,
    bInvalidUsername,
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
        dispatch(setProvider(results.provider));
      } else {
        fetch('./auth/anonymous', { method: 'GET' });
        dispatch(setUsername('anonymous'));
        dispatch(setPhotoURL(''));
        dispatch(setUid(-1));
        dispatch(setProvider('anonymous'));
      }
    });
}

export function changeUsername(dispatch, name) {
  const method = 'POST';
  const body = JSON.stringify({ name });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/changeUsername', { method, headers, body })
    .then(res => res.json())
    .then((res) => {
      if (res.errState === 2) {
        dispatch(setBInvalidUsername(true));
      } else {
        dispatch(setBInvalidUsername(false));
        loadMe(dispatch);
      }
    })
    .catch(console.error);
}

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

export function setSearchTitle(searchTitle) {
  return {
    type: actionTypes.SET_SEARCH_TITLE,
    searchTitle,
  };
}

export function setSearchUser(searchUser) {
  return {
    type: actionTypes.SET_SEARCH_USER,
    searchUser,
  };
}

export function setCountQuestions(count) {
  return {
    type: actionTypes.SET_COUNT_QUESTIONS,
    count,
  };
}

export function loadCountQuestions(dispatch, lowBPM = 0, highBPM = 1000, title = '', user = '') {
  const method = 'GET';
  const params = new URLSearchParams();
  params.set('lowBPM', lowBPM);
  params.set('highBPM', highBPM);
  params.set('title', title);
  params.set('user', user);
  fetch(`./api/countQuestions?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      dispatch(setCountQuestions(results.count));
    })
    .catch(console.error);
}
