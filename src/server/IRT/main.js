/*
 Item Response Theory に基づいて，全ユーザと全問題のレーテイングを推定し，
 推定結果をデータベースに保存するスクリプト．
 （定期実行させる）
*/

const FULL_SCORE = 100;

const client = require('../pgClient');

/*
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
*/

function mean(xs) { // of Array
  let sum = 0;
  for (let i = 0; i < xs.length; i += 1) {
    sum += xs[i];
  }
  return sum / xs.length;
}

function std(xs) { // of Array
  const mu = mean(xs);
  let sum = 0;
  for (let i = 0; i < xs.length; i += 1) {
    sum += (xs[i] - mu) ** 2;
  }
  return sum / xs.length;
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function IRTderivative(scoreList, r, theta, a) {
  /*
    scoreList: [[uid, qid, score], ...]
    score should be normalized in 0--1
  */
  const nu = r.length;
  const nq = theta.length;
  const derR = new Array(nu).fill(0);
  const derTheta = new Array(nq).fill(0);
  const derA = new Array(nq).fill(0);

  for (let i = 0; i < scoreList.length; i += 1) {
    const u = scoreList[i][0]; // user
    const q = scoreList[i][1]; // question
    const sc = scoreList[i][2]; // score

    const sigmoidValue = sigmoid(a[q] * (r[u] - theta[q]));
    derR[u] += a[q] * (-sc + sigmoidValue);
    derTheta[q] += a[q] * (sc - sigmoidValue);
    derA[q] += (r[u] - theta[q]) * (-sc + sigmoidValue);
  }

  for (let u = 0; u < nu; u += 1) {
    derR[u] += r[u];
  }
  for (let q = 0; q < nq; q += 1) {
    derTheta[q] += theta[q];
  }

  return { derR, derTheta, derA };
}

function calculateIRT(scoreList) {
  /*
    scoreList: [[uid, qid, score], ...]
    score should be normalized in 0--1

    returns: estimated values of { r, theta, a }
    prior of r & theta : N(0, 1)
    prior of a : delta(1.0)
      (TODO: nontrivial prior of a: e.g. Inverse-Gamma (uniform -> diverge of a ??) )

    (TODO: is the loss func convex ?)
  */
  let nu = 0;
  let nq = 0;
  for (let i = 0; i < scoreList.length; i += 1) {
    nu = Math.max(nu, scoreList[i][0]);
    nq = Math.max(nq, scoreList[i][1]);
  }
  nu += 1;
  nq += 1;

  const r = new Array(nu).fill(0);
  const theta = new Array(nq).fill(0);
  const a = new Array(nq).fill(1.0);

  const numIter = 100000;
  for (let i = 0; i < numIter; i += 1) {
    const lr = 0.01 * (0.1 ** (i / numIter));
    const grad = IRTderivative(scoreList, r, theta, a);
    for (let u = 0; u < nu; u += 1) r[u] -= lr * grad.derR[u];
    for (let q = 0; q < nq; q += 1) theta[q] -= lr * grad.derTheta[q];
    // for (let q = 0; q < nq; q += 1) a[q] -= lr * grad.derA[q];
  }

  return { r, theta, a };
}

const query = {
  text: 'SELECT * from scores ORDER BY id',
};
client.query(query)
  .then((result) => {
    // create score list
    const scoreSet = {};
    for (let i = 0; i < result.rows.length; i += 1) {
      const row = result.rows[i];
      const record = scoreSet[[row.uid, row.qid]];
      if (record) {
        scoreSet[[row.uid, row.qid]] = [
          row.uid, row.qid, Math.max(row.score / FULL_SCORE, record.score)];
      } else {
        scoreSet[[row.uid, row.qid]] = [row.uid, row.qid, row.score / FULL_SCORE];
      }
    }
    // scoreList: [[uid<int>, qid<int>, score<0--1>], ... ]
    const scoreList = Object.values(scoreSet);

    // calclate IRT
    const rslt = calculateIRT(scoreList);

    /*
    console.log('RESULT');
    console.log(rslt.r);
    console.log(rslt.theta);
    console.log(rslt.a);
    */

    const uRating = rslt.r;
    const qRating = rslt.theta;

    // rescale rating
    const mu = mean(uRating);
    const sigma = std(uRating);
    for (let i = 0; i < uRating.length; i += 1) {
      uRating[i] = (uRating[i] - mu) / sigma * 500 + 1500;
    }
    console.log(uRating);
    for (let i = 0; i < qRating.length; i += 1) {
      qRating[i] = (qRating[i] - mu) / sigma * 500 + 1500;
    } // TODO: should we use qRating together to determine mu and sigma?

    // update DB
    let queryText = 'UPDATE users u SET rating = s.rating FROM UNNEST(ARRAY[';
    for (let i = 0; i < uRating.length; i += 1) {
      if (i > 0) queryText += ', ';
      queryText += '(' + Number(uRating[i]) + ', ' + Number(i) + ')';
    }
    queryText += ']) s (rating NUMERIC, id INT) WHERE u.id = s.id';
    client.query({ text: queryText })
      .then((result2) => {
        queryText = 'UPDATE questions u SET rating = s.rating FROM UNNEST(ARRAY[';
        for (let i = 0; i < qRating.length; i += 1) {
          if (i > 0) queryText += ', ';
          queryText += '(' + Number(qRating[i]) + ', ' + Number(i) + ')';
        }
        queryText += ']) s (rating NUMERIC, id INT) WHERE u.id = s.id';
        client.query({ text: queryText })
          .then((result3) => { client.end(); })
          .catch((e) => { console.log(e); });
      })
      .catch((e) => { console.log(e); });
  })
  .catch((e) => { console.log(e); });
