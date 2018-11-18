import actionTypes from './actionTypes';
import Question from '../data/question';
import User from '../data/user';
import filterLevels from '../data/filterLevels';

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

export function openFAQDialog() {
  return {
    type: actionTypes.OPEN_FAQ_DIALOG,
  };
}

export function closeFAQDialog() {
  return {
    type: actionTypes.CLOSE_FAQ_DIALOG,
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

export function deleteUploadedQuestion(questionId, callback) {
  const method = 'POST';
  const body = JSON.stringify({ id: questionId });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/deleteQuestion', { method, headers, body })
    .then((res) => {
      callback();
      return res.json();
    })
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
    .catch(console.error);
}

export function setCountQuestions(count) {
  return {
    type: actionTypes.SET_COUNT_QUESTIONS,
    count,
  };
}

export function loadQuestionsList(dispatch, searchQuery, start = 1, stop = 10) {
  dispatch(clearQuestionsList());

  const method = 'GET';
  const params = new URLSearchParams();
  params.set('lowBPM', searchQuery.lowBPM);
  params.set('highBPM', searchQuery.highBPM);
  params.set('title', searchQuery.title);
  params.set('user', searchQuery.user);
  params.set('madeByMe', searchQuery.madeByMe);
  params.set('answered', searchQuery.answered);
  params.set('unanswered', searchQuery.unanswered);

  let lowRating;
  let highRating;
  switch (searchQuery.level) {
    case filterLevels.TO_TWO_HND:
      lowRating = -10000;
      highRating = 200;
      break;
    case filterLevels.TWO_HND_TO_FOUR_HND:
      lowRating = 200;
      highRating = 400;
      break;
    case filterLevels.FOUR_HND_TO_SIX_HND:
      lowRating = 400;
      highRating = 600;
      break;
    case filterLevels.SIX_HND_TO_EIGHT_HND:
      lowRating = 600;
      highRating = 800;
      break;
    case filterLevels.EIGHT_HND_TO_ONE_K:
      lowRating = 800;
      highRating = 1000;
      break;
    case filterLevels.FROM_ONE_K:
      lowRating = 1000;
      highRating = 10000;
      break;
    case filterLevels.ALL:
    default:
      lowRating = -10000;
      highRating = 10000;
      break;
  }
  params.set('lowRating', lowRating);
  params.set('highRating', highRating);
  params.set('showNoLevel', searchQuery.showNoLevel);

  params.set('start', start);
  params.set('stop', stop);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.forEach((item) => {
        dispatch(addQuestionToList(item.id, Question.fromJS(item.question)));
      });
    })
    .catch(console.error);
}

export function loadCountQuestions(dispatch, searchQuery) {
  const method = 'GET';
  const params = new URLSearchParams();
  params.set('lowBPM', searchQuery.lowBPM);
  params.set('highBPM', searchQuery.highBPM);
  params.set('title', searchQuery.title);
  params.set('user', searchQuery.user);
  params.set('madeByMe', searchQuery.madeByMe);
  params.set('answered', searchQuery.answered);
  params.set('unanswered', searchQuery.unanswered);

  let lowRating;
  let highRating;
  switch (searchQuery.level) {
    case filterLevels.TO_TWO_HND:
      lowRating = -10000;
      highRating = 200;
      break;
    case filterLevels.TWO_HND_TO_FOUR_HND:
      lowRating = 200;
      highRating = 400;
      break;
    case filterLevels.FOUR_HND_TO_SIX_HND:
      lowRating = 400;
      highRating = 600;
      break;
    case filterLevels.SIX_HND_TO_EIGHT_HND:
      lowRating = 600;
      highRating = 800;
      break;
    case filterLevels.EIGHT_HND_TO_ONE_K:
      lowRating = 800;
      highRating = 1000;
      break;
    case filterLevels.FROM_ONE_K:
      lowRating = 1000;
      highRating = 10000;
      break;
    case filterLevels.ALL:
    default:
      lowRating = -10000;
      highRating = 10000;
      break;
  }
  params.set('lowRating', lowRating);
  params.set('highRating', highRating);
  params.set('showNoLevel', searchQuery.showNoLevel);

  fetch(`./api/countQuestions?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      dispatch(setCountQuestions(results.count));
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
  params.set('madeByMe', false);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.forEach((item) => {
        dispatch(addQuestionToNewList(item.id, Question.fromJS(item.question)));
      });
    })
    .catch(console.error);
}

export function saveAnswer(qid, notes, score) {
  const method = 'POST';
  const body = JSON.stringify({ qid, notes, score });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/saveAnswer', { method, headers, body })
    .then(res => res.json())
    .catch(console.error);
}

export function setDisplayName(displayName) {
  return {
    type: actionTypes.SET_DISPLAY_NAME,
    displayName,
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

export function loadMe(dispatch) {
  fetch('./api/getMe', { method: 'GET' })
    .then(res => res.json())
    .then((results) => {
      if (results.id !== -1) {
        dispatch(setDisplayName(results.displayName));
        dispatch(setPhotoURL(results.photoURL));
        dispatch(setUid(results.id));
        dispatch(setProvider(results.provider));
      } else {
        dispatch(setDisplayName('anonymous'));
        dispatch(setPhotoURL(''));
        dispatch(setUid(-1));
        dispatch(setProvider('anonymous'));
      }
    });
}

export function changeDisplayName(dispatch, name) {
  const method = 'POST';
  const body = JSON.stringify({ name });
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  fetch('./api/changeDisplayName', { method, headers, body })
    .then(res => res.json())
    .then(() => {
      loadMe(dispatch);
    })
    .catch(console.error);
}

export function addRankedUser(rank, user) {
  return {
    type: actionTypes.ADD_RANKED_USER,
    rank,
    user,
  };
}

export function clearRankingUsers() {
  return {
    type: actionTypes.CLEAR_RANKING_USERS,
  };
}

export function loadRanking(dispatch, start = 1, stop = 10) {
  dispatch(clearRankingUsers());

  const method = 'GET';
  const params = new URLSearchParams();
  params.set('start', start);
  params.set('stop', stop);
  fetch(`./api/getRanking?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.ranking.forEach((item, idx) => {
        dispatch(addRankedUser(start + idx, new User(item)));
      });
    })
    .catch(console.error);
}

export function addQuestionToOsusumeList(id, question) {
  return {
    type: actionTypes.ADD_QUESTION_TO_OSUSUME_LIST,
    id,
    question,
  };
}

export function clearOsusumeQuestionsList() {
  return {
    type: actionTypes.CLEAR_OSUSUME_QUESTIONS_LIST,
  };
}

export function loadOsusumeQuestionsList(dispatch) {
  dispatch(clearOsusumeQuestionsList());
  const method = 'GET';
  const params = new URLSearchParams();
  params.set('start', 1);
  params.set('stop', 4);
  params.set('orderMode', 'osusume');
  params.set('madeByMe', false);
  params.set('answered', false);
  fetch(`./api/loadQuestionsList?${params.toString()}`, { method })
    .then(res => res.json())
    .then((results) => {
      results.forEach((item) => {
        dispatch(addQuestionToOsusumeList(item.id, Question.fromJS(item.question)));
      });
    })
    .catch(console.error);
}
