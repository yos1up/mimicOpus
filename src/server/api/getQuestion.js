const client = require('../pgClient');

const getQuestion = (req, res) => {
  const data = req.query;
  const uid = req.isAuthenticated() ? req.user.id : -1;
  const query = {
    text: 'SELECT q.id, q.notes, q.bpm, q.uid, u.displayName, q.title, q.uploadedat, q.rating, s.score, n.count FROM questions q '
      + 'LEFT JOIN users u ON q.uid = u.id '
      + 'LEFT JOIN (SELECT DISTINCT on (uid, qid) qid, score FROM answers WHERE uid = $1 ORDER BY uid, qid, score DESC) s ON q.id = s.qid '
      + 'LEFT JOIN (SELECT qid, COUNT(DISTINCT uid) FROM answers GROUP BY qid) n ON q.id = n.qid '
      + 'WHERE q.id = $2',
    values: [uid, data.qid],
  };

  client.query(query)
    .then((result) => {
      const item = result.rows[0];
      const question = {
        notes: item.notes,
        bpm: item.bpm,
        uid: item.uid,
        displayName: item.displayname,
        title: item.title,
        uploadedAt: item.uploadedat,
        rating: item.rating,
      };
      res.send({ question, errState: 0 });
    })
    .catch((e) => {
      console.log(e);
      res.send({ errState: 1 });
    });
};

module.exports = getQuestion;
