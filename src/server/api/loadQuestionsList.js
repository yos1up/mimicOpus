const client = require('../pgClient');

const defaultQuestionQuery = require('./defaultQuestionQuery');


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

module.exports = loadQuestionsList;
