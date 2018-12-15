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
  return query;
};

const loadQuestionsList = (req, res) => {
  const urlQuery = defaultQuestionQuery(req.query);
  if (urlQuery.start === null || urlQuery.start === undefined) {
    urlQuery.start = 1;
  }
  if (urlQuery.stop === null || urlQuery.stop === undefined) {
    urlQuery.stop = 10;
  }

  if (urlQuery.user === '') {
    urlQuery.user = '%';
  }

  let levelFilterQuery = '(q.rating >= $6 and q.rating <= $7)';
  if (urlQuery.showNoLevel) {
    levelFilterQuery = `(q.rating is null or ${levelFilterQuery})`;
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
    myRating = 800;
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
      text: `${'SELECT q.id, q.notes, q.bpm, q.uid, u.displayName, q.title, q.uploadedat, q.rating, s.score, n.count FROM questions q '
        + 'LEFT JOIN users u ON q.uid = u.id '
        + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
        + 'LEFT JOIN (SELECT qid, COUNT(DISTINCT uid) FROM answers GROUP BY qid) n ON q.id = n.qid '
        + 'WHERE q.bpm >= $2 and q.bpm <= $3 and q.title LIKE $4 and u.displayName LIKE $5 and '
      }${filterQuery
      }${' and '
      }${levelFilterQuery
      }${' ORDER BY q.uploadedat DESC LIMIT $8 OFFSET $9'}`,
      values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser,
        urlQuery.lowRating, urlQuery.highRating,
        urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
    };
  } else { // osusume
    query = {
      text: `${'SELECT q.id, q.notes, q.bpm, q.uid, u.displayName, q.title, q.uploadedat, q.rating, s.score, n.count FROM questions q '
        + 'LEFT JOIN users u ON q.uid = u.id '
        + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
        + 'LEFT JOIN (SELECT qid, COUNT(DISTINCT uid) FROM answers GROUP BY qid) n ON q.id = n.qid '
        + 'WHERE q.bpm >= $2 and q.bpm <= $3 and q.title LIKE $4 and u.displayName LIKE $5 and '
      }${filterQuery
      }${' and '
      }${levelFilterQuery
      }${' ORDER BY abs($8 - q.rating) LIMIT $9 OFFSET $10'}`,
      values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser,
        urlQuery.lowRating, urlQuery.highRating, myRating - 1000,
        urlQuery.stop - urlQuery.start + 1, urlQuery.start - 1],
    };
  }

  client.query(query)
    .then((result) => {
      const returnData = [];
      result.rows.forEach((item) => {
        const playedUserNum = (item.count !== null && item.count !== undefined) ? item.count : 0;
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
            playedUserNum,
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
  const urlQuery = defaultQuestionQuery(req.query);

  if (urlQuery.user === '') {
    urlQuery.user = '%';
  }

  let levelFilterQuery = '(q.rating >= $6 and q.rating <= $7)';
  if (urlQuery.showNoLevel) {
    levelFilterQuery = `(q.rating is null or ${levelFilterQuery})`;
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
    }${' and '
    }${levelFilterQuery
    }`,
    values: [uid, urlQuery.lowBPM, urlQuery.highBPM, queryTitle, queryUser,
      urlQuery.lowRating, urlQuery.highRating],
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

const evaluateAnswer = (qNotes, aNotes) => {
  /* 評価関数どうしますかね・・・

  Wasserstein距離？ 編集距離？ 重なりの面積？ 完全一致？ F-value? 音ゲー式？
  評価対象はノートオンのみ？

  qMel, aMel: ノーツオブジェクトを各要素にもつ array
              ノーツオブジェクト： {start:(ノートオン時刻[s]), end:(ノートオフ時刻[s]), pitch:(ノートナンバー)}
  */
  // 音ゲー式をまずは実装してみる．
  const qEventOfEachPitch = Array(128);
  for (let i = 0; i < 128; i += 1) qEventOfEachPitch[i] = new Array(0);
  const aEventOfEachPitch = Array(128);
  for (let i = 0; i < 128; i += 1) aEventOfEachPitch[i] = new Array(0);
  for (let i = 0; i < qNotes.length; i += 1) {
    qEventOfEachPitch[qNotes[i].pitch].push(qNotes[i].start);
  }
  for (let i = 0; i < aNotes.length; i += 1) {
    aEventOfEachPitch[aNotes[i].pitch].push(aNotes[i].start);
  }

  const redundantPenalty = -0.5; // [pt]
  const relevantInterval = 0.1; // [s]
  const scoreDecay = 0.1; // [s]
  let score = 0;

  for (let i = 0; i < 128; i += 1) { // ピッチごとに採点をする．
    if (qEventOfEachPitch[i].length === 0) {
      score += redundantPenalty * aEventOfEachPitch[i].length;
    } else {
      qEventOfEachPitch[i].sort((a, b) => a - b);
      aEventOfEachPitch[i].sort((a, b) => a - b);
      /*  回答の各ノーツを，時刻の早いものから順に見ていく．
          回答の各ノーツについて，
            その回答ノーツに「近接」した正解ノーツがある場合は
              それらの近接度に応じてスコアを加算し（同時なら満点），その正解ノーツを「削除」する．
            その回答ノーツに「近接」した正解ノーツがない場合は，
              スコアを減点する．
      */
      const check = Array(qEventOfEachPitch[i].length).fill(false);
      let qOffset = 0;
      for (let j = 0; j < aEventOfEachPitch[i].length; j += 1) {
        const t = aEventOfEachPitch[i][j];
        while (qOffset < qEventOfEachPitch[i].length
          && qEventOfEachPitch[i][qOffset] < t) qOffset += 1;

        let leftidx = qOffset - 1; // tの左側で，最も近接した「未チェックノート」との時間差
        while (leftidx >= 0 && check[leftidx]) leftidx -= 1;
        const left = (leftidx >= 0) ? (t - qEventOfEachPitch[i][leftidx]) : Infinity;

        let rightidx = qOffset; // tの右側で，最も近接した「未チェックノート」との時間差
        while (rightidx < qEventOfEachPitch[i].length
          && check[rightidx]) rightidx += 1;
        const right = (rightidx < qEventOfEachPitch[i].length)
          ? (qEventOfEachPitch[i][rightidx] - t) : Infinity;

        const minDist = Math.min(left, right);
        // console.log(minDist);
        if (minDist < relevantInterval) { // 「近接」した正解ノーツがある場合は
          score += Math.exp(-minDist / scoreDecay);
          check[(left < right) ? leftidx : rightidx] = true;
        } else { // 「近接」した正解ノーツがない場合は，
          score += redundantPenalty;
        }
      }
    }
  }
  score = Math.max(0, score);
  score *= 100 / qNotes.length;

  return score;
};

const submitAnswer = (req, res) => {
  const data = req.body;
  let query = {
    text: 'SELECT * from questions WHERE id = $1',
    values: [data.qid],
  };

  client.query(query)
    .then((result) => {
      const qNotes = result.rows[0].notes;
      const score = evaluateAnswer(qNotes, data.notes);

      if (req.isAuthenticated()) {
        query = {
          text: 'INSERT INTO answers(qid, uid, notes, score) VALUES($1, $2, $3, $4)',
          values: [data.qid, req.user.id, JSON.stringify(data.notes), score],
        };

        client.query(query)
          .then(() => res.send({
            score,
            saved: true,
            errState: 0,
          }))
          .catch((e) => {
            console.log(e);
            res.send({ errState: 1 });
          });
      } else {
        res.send({
          score,
          saved: false,
          errState: 0,
        });
      }
    }).catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
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


const loadBestSubmission = (req, res) => {
  if (req.isAuthenticated()) {
    const urlQuery = defaultQuestionQuery(req.query);
    const uid = req.user.id;
    const qid = Number(urlQuery.qid);

    const query = {
      text: 'SELECT notes from answers where uid = ($1) and qid = ($2) ORDER BY score DESC LIMIT 1',
      values: [uid, qid],
    };
    client.query(query)
      .then((result) => {
        if (result.rows[0]) {
          res.send({ errState: 0, notes: result.rows[0].notes });
        } else {
          res.send({ errState: 1 });
        } // 存在しない場合
      })
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    res.send({ errState: 1 });
  }
};

apiRouter.post('/api/uploadQuestion', uploadQuestion);
apiRouter.get('/api/loadQuestionsList', loadQuestionsList);
apiRouter.get('/api/countQuestions', countQuestions);
apiRouter.post('/api/deleteQuestion', deleteQuestion);
apiRouter.post('/api/submitAnswer', submitAnswer);
apiRouter.post('/api/changeDisplayName', changeDisplayName);
apiRouter.get('/api/getRanking', getRanking);
apiRouter.get('/api/getMe', getMe);
apiRouter.get('/api/loadBestSubmission', loadBestSubmission);

module.exports = apiRouter;
