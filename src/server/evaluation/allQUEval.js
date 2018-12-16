const client = require('../pgClient');

const questionEval = require('./questionEval');
const userEval = require('./userEval');

function toSqlNumericString(x) {
  if (Number.isNaN(x)) return '0.0';
  const ret = `${Number(x)}`;
  // to avoid "error: rows returned by function are not all of the same row type"
  if (ret.indexOf('.') === -1) return `${ret}.`;
  return ret;
}

let query = {
  text: 'SELECT q.title, q.id, q.notes, q.bpm from questions q'
};
let queryText;

client.query(query)
  .then((result) => {
    queryText = 'UPDATE questions u SET rating = s.rating FROM UNNEST(ARRAY[';
    for (let i = 0; i < result.rows.length; i += 1) {
      const item = result.rows[i];
      if (i > 0) queryText += ', ';
      queryText += `(${toSqlNumericString(questionEval(item.notes, item.bpm))}, ${Number(item.id)})`;
    }
    queryText += ']) s (rating NUMERIC, id INT) WHERE u.id = s.id';
    query = {
      text: queryText
    };

    client.query(query)
      .then(() => {
        console.log('DB updated successfully. (questions)');
        query = {
          text: 'SELECT DISTINCT on (a.uid, a.qid) a.uid, a.qid, a.score, q.rating FROM answers a '
            + 'LEFT JOIN questions q ON q.id = a.qid '
            + 'ORDER BY a.uid, a.qid, a.score DESC',
        };

        client.query(query)
          .then((result2) => {
            let tmpScores = [];
            let tmpRatings = [];
            queryText = 'UPDATE users u SET rating = s.rating FROM UNNEST(ARRAY[';

            for (let i = 0; i < result2.rows.length; i += 1) {
              tmpScores.push(result2.rows[i].score);
              tmpRatings.push(result2.rows[i].rating);
              if (i === result2.rows.length - 1
                || result2.rows[i].uid !== result2.rows[i + 1].uid) {
                queryText += `(${toSqlNumericString(userEval(tmpRatings, tmpScores))}, ${Number(result2.rows[i].uid)})`;
                if (i !== result2.rows.length - 1) queryText += ', ';
                tmpScores = [];
                tmpRatings = [];
              }
            }
            queryText += ']) s (rating NUMERIC, id INT) WHERE u.id = s.id';
            query = {
              text: queryText
            };
            client.query(query)
              .then(() => {
                console.log('DB updated successfully. (users)');
                client.end();
              })
              .catch((e) => { console.log(e); client.end(); });
          })
          .catch((e) => { console.log(e); client.end(); });
      })
      .catch((e) => { console.log(e); client.end(); });
  })
  .catch((e) => { console.log(e); client.end(); });
