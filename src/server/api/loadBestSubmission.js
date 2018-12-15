const client = require('../pgClient');

const loadBestSubmission = (req, res) => {
  if (req.isAuthenticated()) {
    const uid = req.user.id;
    const qid = Number(req.query.qid);

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

module.exports = loadBestSubmission;
