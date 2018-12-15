const client = require('../pgClient');

const defaultQuestionQuery = require('./defaultQuestionQuery');


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

module.exports = countQuestions;
