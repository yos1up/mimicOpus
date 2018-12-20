const client = require('../pgClient');

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

module.exports = changeDisplayName;
