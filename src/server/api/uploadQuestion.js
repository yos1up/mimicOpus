const client = require('../pgClient');
const questionEval = require('../evaluation/questionEval');


const uploadQuestion = (req, res) => {
  if (req.isAuthenticated() || req.user.provider !== 'anonymous') {
    const data = req.body;
    const query = {
      text: 'INSERT INTO questions(notes, bpm, uid, title, uploadedAt, rating) VALUES($1, $2, $3, $4, $5, $6)',
      values: [JSON.stringify(data.notes), data.bpm, req.user.id, data.title, new Date(),
        questionEval(data.notes, data.bpm)],
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

module.exports = uploadQuestion;
