const client = require('../pgClient');

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

module.exports = getRanking;
