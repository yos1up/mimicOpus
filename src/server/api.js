const express = require('express');

const client = require('./pgClient');

const apiRouter = express.Router();

const uploadQuestion = (req, res) => {
  if (req.isAuthenticated() || req.user.provider !== 'anonymous') {
    const data = req.body;
    const query = {
      text: 'INSERT INTO questions(notes, bpm, uid, title, uploadedAt, rating) VALUES($1, $2, $3, $4, $5, $6)',
      values: [JSON.stringify(data.notes), data.bpm, req.user.id, data.title, new Date(), null],
    };
    client.query(query)
      .then(() => res.send({ errState: 0 }))
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({ errState: 1 });
  }
};

const deleteQuestion = (req, res) => {
  if (req.isAuthenticated() || req.user.provider !== 'anonymous') {
    const { id } = req.body;
    const query = {
      text: 'DELETE FROM questions WHERE id = $1 and uid=$2',
      values: [id, req.user.id],
    };
    client.query(query)
      .then(() => res.send({ errState: 0 }))
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({ errState: 1 });
  }
};

const loadQuestionsList = (req, res) => {
  const urlQuery = req.query;
  if (urlQuery.lowBPM === null || urlQuery.lowBPM === undefined) {
    urlQuery.lowBPM = 60;
  }
  if (urlQuery.highBPM === null || urlQuery.highBPM === undefined) {
    urlQuery.highBPM = 200;
  }
  if (urlQuery.start === null || urlQuery.start === undefined) {
    urlQuery.start = 1;
  }
  if (urlQuery.stop === null || urlQuery.stop === undefined) {
    urlQuery.stop = 10;
  }
  if (urlQuery.title === null || urlQuery.title === undefined) {
    urlQuery.title = '';
  }
  if (urlQuery.user === null || urlQuery.user === undefined) {
    urlQuery.user = '';
  }
  if (urlQuery.madeByMe === 'true' || urlQuery.madeByMe === null || urlQuery.madeByMe === undefined) {
    urlQuery.madeByMe = true;
  } else {
    urlQuery.madeByMe = false;
  }
  if (urlQuery.answered === 'true' || urlQuery.answered === null || urlQuery.answered === undefined) {
    urlQuery.answered = true;
  } else {
    urlQuery.answered = false;
  }
  if (urlQuery.unanswered === 'true' || urlQuery.unanswered === null || urlQuery.unanswered === undefined) {
    urlQuery.unanswered = true;
  } else {
    urlQuery.unanswered = false;
  }
  if (urlQuery.orderMode === null || urlQuery.orderMode === undefined) {
    urlQuery.orderMode = 'new';
  }

  if (urlQuery.user === '') {
    urlQuery.user = '%';
  }
  let filterQuery = '(false';
  if (urlQuery.madeByMe) {
    filterQuery += ' or q.uid = $1';
  }
  if (urlQuery.answered) {
    filterQuery += ' or s.score is not null';
  }
  if (urlQuery.unanswered) {
    filterQuery += ' or (s.score is null and q.uid != $1)';
  }
  filterQuery += ')';

  let query;
  let myRating;
  let uid;
  if (req.isAuthenticated() && req.user.rating !== null && req.user.rating !== undefined) {
    myRating = req.user.rating;
  } else {
    myRating = 1500;
  }
  if (req.isAuthenticated()) {
    uid = req.user.id;
  } else {
    uid = -1;
  }
  const queryTitle = `%${urlQuery.title}%`;
  const queryUser = `${urlQuery.user}`;
  if (urlQuery.orderMode === 'new') {
    query = {
      text: `${'SELECT q.id, q.notes, q.bpm, q.uid, u.displayName, q.title, q.uploadedat, q.rating, s.score FROM questions q '
        + 'LEFT JOIN users u ON q.uid = u.id '
        + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
        + 'WHERE q.bpm >= $2 and q.bpm <= $3 and q.title LIKE $4 and u.displayName LIKE $5 and '
      }${filterQuery
      }${' ORDER BY q.uploadedat DESC LIMIT $6 OFFSET $7'}`,
      values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser,
        urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
    };
  } else { // osusume
    query = {
      text: `${'SELECT q.id, q.notes, q.bpm, q.uid, u.displayName, q.title, q.uploadedat, q.rating, s.score FROM questions q '
        + 'LEFT JOIN users u ON q.uid = u.id '
        + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
        + 'WHERE q.bpm >= $2 and q.bpm <= $3 and q.title LIKE $4 and u.displayName LIKE $5 and '
      }${filterQuery
      }${' ORDER BY abs($6 - q.rating) LIMIT $7 OFFSET $8'}`,
      values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser,
        myRating - 693, urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
    };
  }

  client.query(query)
    .then((result) => {
      const returnData = [];
      result.rows.forEach((item) => {
        returnData.push({
          id: item.id,
          question: {
            notes: item.notes,
            bpm: item.bpm,
            uid: item.uid,
            displayName: item.displayname,
            title: item.title,
            uploadedAt: item.uploadedat,
            score: item.score,
            rating: item.rating,
          }
        });
      });
      res.send(returnData);
    })
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

const countQuestions = (req, res) => {
  const urlQuery = req.query;
  if (urlQuery.lowBPM === null || urlQuery.lowBPM === undefined) {
    urlQuery.lowBPM = 60;
  }
  if (urlQuery.highBPM === null || urlQuery.highBPM === undefined) {
    urlQuery.highBPM = 200;
  }
  if (urlQuery.title === null || urlQuery.title === undefined) {
    urlQuery.title = '';
  }
  if (urlQuery.user === null || urlQuery.user === undefined) {
    urlQuery.user = '';
  }
  if (urlQuery.madeByMe === 'true' || urlQuery.madeByMe === null || urlQuery.madeByMe === undefined) {
    urlQuery.madeByMe = true;
  } else {
    urlQuery.madeByMe = false;
  }
  if (urlQuery.answered === 'true' || urlQuery.answered === null || urlQuery.answered === undefined) {
    urlQuery.answered = true;
  } else {
    urlQuery.answered = false;
  }
  if (urlQuery.unanswered === 'true' || urlQuery.unanswered === null || urlQuery.unanswered === undefined) {
    urlQuery.unanswered = true;
  } else {
    urlQuery.unanswered = false;
  }
  if (urlQuery.user === '') {
    urlQuery.user = '%';
  }
  let filterQuery = '(false';
  if (urlQuery.madeByMe) {
    filterQuery += ' or q.uid = $1';
  }
  if (urlQuery.answered) {
    filterQuery += ' or s.score is not null';
  }
  if (urlQuery.unanswered) {
    filterQuery += ' or s.score is null';
  }
  filterQuery += ')';

  let uid;
  if (req.isAuthenticated()) {
    uid = req.user.id;
  } else {
    uid = -1;
  }

  const queryTitle = `%${urlQuery.title}%`;
  const queryUser = `${urlQuery.user}`;
  const query = {
    text: `${'SELECT COUNT(*) FROM questions q '
      + 'LEFT JOIN users u ON q.uid = u.id '
      + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
      + 'WHERE q.bpm >= $2 and q.bpm <= $3 and q.title LIKE $4 and u.displayName LIKE $5 and '
    }${filterQuery
    }`,
    values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser],
  };

  client.query(query)
    .then((result) => {
      res.send({ errState: 0, count: parseInt(result.rows[0].count, 10) });
    })
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

const changeDisplayName = (req, res) => {
  if (req.isAuthenticated()) {
    const uid = req.user.id;
    const data = req.body;
    const { name } = data;
    const query = {
      text: 'UPDATE users SET displayName = ($1) WHERE id=($2)',
      values: [name, uid],
    };
    client.query(query)
      .then(() => res.send({ errState: 0 }))
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({ errState: 1 });
  }
};

const saveAnswer = (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;
    const query = {
      text: 'INSERT INTO answers(qid, uid, notes, score) VALUES($1, $2, $3, $4)',
      values: [data.qid, req.user.id, JSON.stringify(data.notes), data.score],
    };

    client.query(query)
      .then(() => res.send({ errState: 0 }))
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({ errState: 1 });
  }
};

const getRanking = (req, res) => {
  const urlQuery = req.query;
  if (urlQuery.start === null || urlQuery.start === undefined) {
    urlQuery.start = 1;
  }
  if (urlQuery.stop === null || urlQuery.stop === undefined) {
    urlQuery.stop = 10;
  }
  const query = {
    text: 'SELECT displayName, rating from users where rating is not null and rating > 0 and provider <> \'anonymous\' '
      + 'ORDER BY rating DESC LIMIT $1 OFFSET $2',
    values: [urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
  };
  client.query(query)
    .then((result) => {
      res.send({
        errState: 0,
        ranking: result.rows.map(item => ({
          displayName: item.displayname,
          rating: item.rating,
        })),
      });
    })
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    res.send({
      id: req.user.id,
      displayName: req.user.displayName,
      photoURL: req.user.photoURL,
      provider: req.user.provider,
    });
  } else {
    res.send({ id: -1 });
  }
};

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.get('/api/countQuestions', countQuestions);
apiRouter.post('/api/deleteQuestion', deleteQuestion);
apiRouter.post('/api/saveAnswer', saveAnswer);
apiRouter.post('/api/changeDisplayName', changeDisplayName);
apiRouter.get('/api/getRanking', getRanking);
apiRouter.get('/api/getMe', getMe);

module.exports = apiRouter;
