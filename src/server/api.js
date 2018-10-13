const express = require('express');

const client = require('./pgClient');

const apiRouter = express.Router();

const uploadQuestion = (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;

    let query = {
      text: 'SELECT * FROM users where provider = $1 and idByProvider = $2',
      values: [req.user.provider, req.user.id],
    };

    client.query(query)
      .then((result) => {
        query = {
          text: 'INSERT INTO questions(notes, bpm, uid, title, uploadedAt) VALUES($1, $2, $3, $4, $5)',
          values: [JSON.stringify(data.notes), data.bpm, result.rows[0].id, data.title, new Date()],
        };
        client.query(query)
          .then(() => res.send({ errState: 0 }))
          .catch((e) => {
            console.log(e);
            res.send({ errState: 1 });
          });
      })
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
  const query = {
    text: 'SELECT * FROM questions LEFT JOIN users ON questions.uid = users.id where BPM >= $1 and BPM <= $2 ORDER BY uploadedAt',
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

const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    const query = {
      text: 'SELECT * FROM users where provider = $1 and idByProvider = $2',
      values: [req.user.provider, req.user.id],
    };
    client.query(query)
      .then((result) => {
        const returnData = {};
        returnData.id = result.rows[0].id;
        returnData.username = result.rows[0].username;
        returnData.photoURL = result.rows[0].photourl;
        res.send(returnData);
      })
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({});
  }
};

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.post('/api/saveScore', saveScore);
apiRouter.get('/api/getMe', getMe);

module.exports = apiRouter;
