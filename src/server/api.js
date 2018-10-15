const express = require('express');

const client = require('./pgClient');

const apiRouter = express.Router();

const uploadQuestion = (req, res) => {
  if (req.isAuthenticated()) {
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
  if (urlQuery.start === null || urlQuery.start === undefined) {
    urlQuery.start = 1;
  }
  if (urlQuery.stop === null || urlQuery.stop === undefined) {
    urlQuery.stop = 10;
  }
  const query = {
    text: 'SELECT q.id, q.notes, q.bpm, q.uid, u.username, q.title, q.uploadedat '
      + 'FROM questions q LEFT JOIN users u ON q.uid = u.id '
      + 'WHERE BPM >= $1 and BPM <= $2 ORDER BY uploadedAt DESC LIMIT $3 OFFSET $4',
    values: [urlQuery.lowBPM, urlQuery.highBPM,
      urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
  };

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
            userName: item.username,
            title: item.title,
            uploadedAt: item.uploadedat,
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

const changeUsername = (req, res) => {
  if (req.isAuthenticated()) {
    const uid = req.user.id;
    const data = req.body;
    const { name } = data;
    let query = {
      text: 'SELECT * from users where username = $1',
      values: [name],
    };
    client.query(query)
      .then((result) => {
        if (result.rows.length === 0) {
          query = {
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
          res.send({ errState: 2 });
        }
      })
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
    res.send({
      id: req.user.id,
      username: req.user.username,
      photoURL: req.user.photoURL,
      provider: req.user.provider,
    });
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
