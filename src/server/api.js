const express = require('express');

const client = require('./pgClient');

const apiRouter = express.Router();

const uploadQuestion = (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;
    const query = {
      text: 'INSERT INTO questions(notes, bpm, uid, title, uploadedAt) VALUES($1, $2, $3, $4, $5)',
      values: [JSON.stringify(data.notes), data.bpm, req.user.id, data.title, new Date()],
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

const changeQuestion = (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;
    const query = {
      text: 'UPDATE questions SET notes = ($1), bpm = ($2), title = ($3) WHERE id=($4)',
      values: [JSON.stringify(data.notes), data.bpm, data.title, data.id],
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
  if (req.isAuthenticated()) {
    const { id } = req.body;
    const query = {
      text: 'DELETE FROM questions WHERE id = $1',
      values: [id],
    };
    client.query(query)
      .then(() => res.send({ errState: 0 }))
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
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
    text: 'SELECT q.id, q.notes, q.bpm, q.uid, u.username, q.title, q.uploadedat FROM questions q LEFT JOIN users u ON q.uid = u.id where BPM >= $1 and BPM <= $2 ORDER BY uploadedAt',
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

const changeUsername = (req, res) => {
  if (req.isAuthenticated()) {
    const uid = req.user.id;
    const data = req.body;
    const { name } = data;
    const query = {
      text: 'UPDATE users SET username = ($1) WHERE id=($2)',
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

const saveScore = (req, res) => {
  if (req.isAuthenticated()) {
    const data = req.body;
    const query = {
      text: 'INSERT INTO scores(qid, uid, score) VALUES($1, $2, $3)',
      values: [data.qid, req.user.id, data.score],
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

const getMe = (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ id: req.user.id, username: req.user.username, photoURL: req.user.photoURL });
  } else {
    res.send({ id: -1 });
  }
};

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.post('/api/changeQuestion', changeQuestion);
apiRouter.post('/api/deleteQuestion', deleteQuestion);
apiRouter.post('/api/saveScore', saveScore);
apiRouter.post('/api/changeUsername', changeUsername);
apiRouter.get('/api/getMe', getMe);

module.exports = apiRouter;
