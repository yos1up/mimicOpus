const defaultQuestionQuery = (query_) => {
  const query = query_;
  if (query.lowBPM === null || query.lowBPM === undefined) {
    query.lowBPM = 60;
  }
  if (query.highBPM === null || query.highBPM === undefined) {
    query.highBPM = 200;
  }
  if (query.title === null || query.title === undefined) {
    query.title = '';
  }
  if (query.user === null || query.user === undefined) {
    query.user = '';
  }
  if (query.lowRating === null || query.lowRating === undefined) {
    query.lowRating = -10000;
  }
  if (query.highRating === null || query.highRating === undefined) {
    query.highRating = 10000;
  }
  if (query.showNoLevel === 'true' || query.showNoLevel === null || query.showNoLevel === undefined) {
    query.showNoLevel = true;
  } else {
    query.showNoLevel = false;
  }
  if (query.madeByMe === 'true' || query.madeByMe === null || query.madeByMe === undefined) {
    query.madeByMe = true;
  } else {
    query.madeByMe = false;
  }
  if (query.answered === 'true' || query.answered === null || query.answered === undefined) {
    query.answered = true;
  } else {
    query.answered = false;
  }
  if (query.unanswered === 'true' || query.unanswered === null || query.unanswered === undefined) {
    query.unanswered = true;
  } else {
    query.unanswered = false;
  }
  if (query.orderMode === null || query.orderMode === undefined) {
    query.orderMode = 'new';
  }
  if (query.completed === 'false' || query.completed === null || query.completed === undefined) {
    query.completed = false;
  } else {
    query.completed = true;
  }
  return query;
};

module.exports = defaultQuestionQuery;
