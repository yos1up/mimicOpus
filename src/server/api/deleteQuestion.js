const client = require('../pgClient');


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

module.exports = deleteQuestion;
