/*
 Item Response Theory に基づいて，全ユーザと全問題のレーテイングを推定し，
 推定結果をデータベースに保存するスクリプト．
 （定期実行させる）
*/

const client = require('../pgClient');


function randNormal(mu, sigma) {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const r = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return r * sigma + mu;
}

function randUniform(a, b) {
  return a + Math.random() * (b - a);
}

function calculateIRT(score) {
  /*
  score: 2-dim Array (#users x #questions)
    欠損値は undefined としてください

  returns: estimated values of { r, theta, a }
  */
  const nu = score.length;
  const nq = score[0].length;

  const r = new Array(nu).fill(0).map(() => randNormal(1500, 500));
  const theta = new Array(nq).fill(0).map(() => randNormal(1500, 500));
  const a = new Array(nq).fill(0).map(() => 1 / randUniform(100, 200));




  /* TODO */


  return { r, theta, a };
}

const query = {
  text: 'SELECT * from scores ORDER BY id',
};
client.query(query)
  .then((result) => {
    let nq = 0; // number of questions
    let nu = 0; // number of users
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows[i];
      nq = Math.max(nq, row.qid);
      nu = Math.max(nu, row.uid);
    }
    nq += 1;
    nu += 1;

    // creating highscore table (nu x nq)
    const score = new Array(nu);
    for (let i = 0; i < score.length; i += 1) {
      score[i] = new Array(nq);
    }
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows[i];
      score[row.uid][row.qid] = (typeof score[row.uid][row.qid] !== 'undefined')
        ? Math.max(score[row.uid][row.qid], row.score) : row.score;
    }

    // calclate IRT
    const rslt = calculateIRT(score);
    console.log(rslt.r);
    console.log(rslt.theta);
    console.log(rslt.a);

    // update DB
    /*
    const recordStr = JSON.stringify([[111.0, 1]]);
    console.log(recordStr);
    const query2 = {
      //text: 'UPDATE users u SET rating = s.rating FROM UNNEST(ARRAY[(5.0, 1), (15.0, 1), (25.0, 2)]) s (rating NUMERIC, id INT) WHERE u.id = s.id',
      //text: 'UPDATE users u SET rating = s.rating FROM UNNEST(ARRAY[ARRAY[5.0, 1], ARRAY[15.0, 1], ARRAY[25.0, 2]]) s (rating NUMERIC, id INT) WHERE u.id = s.id',
      //values: [recordStr],
      text: 'UPDATE users u SET rating = s.rating FROM UNNEST($1::text[]) s (rating NUMERIC, id INT) WHERE u.id = s.id',
      values: [JSON.stringify([[5.0, 1], [15.0, 1], [25.0, 2]])],
    };
    console.log('ok');
    client.query(query2)
      .then((result2) => {client.end();})
      .catch((e) => { console.log('Errorroror'); console.log(e); });

    */
    client.end();
  })
  .catch((e) => {
    console.log(e);
  });
