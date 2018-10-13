const express = require('express');

const client = require('./pgClient');

const apiRouter = express.Router();

const uploadQuestion = (req, res) => {
  const data = req.body;
  const query = {
    text: 'INSERT INTO questions(notes, bpm, uid, userName, title, uploadedAt) VALUES($1, $2, $3, $4, $5, $6)',
    values: [JSON.stringify(data.notes), data.bpm, data.uid, data.userName, data.title, new Date()],
  };

  client.query(query)
    .then(() => res.send({ errState: 0 }))
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

const loadQuestionsList = (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
  }
  const urlQuery = req.query;
  if (urlQuery.lowBPM === null || urlQuery.lowBPM === undefined) {
    urlQuery.lowBPM = 60;
  }
  if (urlQuery.highBPM === null || urlQuery.highBPM === undefined) {
    urlQuery.highBPM = 200;
  }
  const query = {
    text: 'SELECT * FROM questions where BPM >= $1 and BPM <= $2 ORDER BY uploadedAt',
    values: [urlQuery.lowBPM, urlQuery.highBPM],
  };

  client.query(query)
    .then((result) => {
      const returnData = {};
      result.rows.forEach((item) => {
        returnData[item.id] = {
          notes: item.notes,
          bpm: item.bpm,
          uid: item.uid,
          userName: item.username,
          title: item.title,
          uploadedAt: item.uploadedat,
        };
      });
      res.send(returnData);
    })
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

const saveScore = (req, res) => {
  const data = req.body;
  const query = {
    text: 'INSERT INTO scores(qid, uid, score) VALUES($1, $2, $3)',
    values: [data.qid, data.uid, data.score],
  };

  client.query(query)
    .then(() => res.send({ errState: 0 }))
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.post('/api/saveScore', saveScore);

module.exports = apiRouter;
