const client = require('../pgClient');

const evaluateAnswer = (qNotes, aNotes) => {
  /* 評価関数どうしますかね・・・

  Wasserstein距離？ 編集距離？ 重なりの面積？ 完全一致？ F-value? 音ゲー式？
  評価対象はノートオンのみ？

  qMel, aMel: ノーツオブジェクトを各要素にもつ array
              ノーツオブジェクト： {start:(ノートオン時刻[s]), end:(ノートオフ時刻[s]), pitch:(ノートナンバー)}
  */
  // 音ゲー式をまずは実装してみる．
  const qEventOfEachPitch = Array(128);
  for (let i = 0; i < 128; i += 1) qEventOfEachPitch[i] = new Array(0);
  const aEventOfEachPitch = Array(128);
  for (let i = 0; i < 128; i += 1) aEventOfEachPitch[i] = new Array(0);
  for (let i = 0; i < qNotes.length; i += 1) {
    qEventOfEachPitch[qNotes[i].pitch].push(qNotes[i].start);
  }
  for (let i = 0; i < aNotes.length; i += 1) {
    aEventOfEachPitch[aNotes[i].pitch].push(aNotes[i].start);
  }

  const redundantPenalty = -0.5; // [pt]
  const relevantInterval = 0.1; // [s]
  const scoreDecay = 0.1; // [s]
  let score = 0;

  for (let i = 0; i < 128; i += 1) { // ピッチごとに採点をする．
    if (qEventOfEachPitch[i].length === 0) {
      score += redundantPenalty * aEventOfEachPitch[i].length;
    } else {
      qEventOfEachPitch[i].sort((a, b) => a - b);
      aEventOfEachPitch[i].sort((a, b) => a - b);
      /*  回答の各ノーツを，時刻の早いものから順に見ていく．
          回答の各ノーツについて，
            その回答ノーツに「近接」した正解ノーツがある場合は
              それらの近接度に応じてスコアを加算し（同時なら満点），その正解ノーツを「削除」する．
            その回答ノーツに「近接」した正解ノーツがない場合は，
              スコアを減点する．
      */
      const check = Array(qEventOfEachPitch[i].length).fill(false);
      let qOffset = 0;
      for (let j = 0; j < aEventOfEachPitch[i].length; j += 1) {
        const t = aEventOfEachPitch[i][j];
        while (qOffset < qEventOfEachPitch[i].length
          && qEventOfEachPitch[i][qOffset] < t) qOffset += 1;

        let leftidx = qOffset - 1; // tの左側で，最も近接した「未チェックノート」との時間差
        while (leftidx >= 0 && check[leftidx]) leftidx -= 1;
        const left = (leftidx >= 0) ? (t - qEventOfEachPitch[i][leftidx]) : Infinity;

        let rightidx = qOffset; // tの右側で，最も近接した「未チェックノート」との時間差
        while (rightidx < qEventOfEachPitch[i].length
          && check[rightidx]) rightidx += 1;
        const right = (rightidx < qEventOfEachPitch[i].length)
          ? (qEventOfEachPitch[i][rightidx] - t) : Infinity;

        const minDist = Math.min(left, right);
        // console.log(minDist);
        if (minDist < relevantInterval) { // 「近接」した正解ノーツがある場合は
          score += Math.exp(-minDist / scoreDecay);
          check[(left < right) ? leftidx : rightidx] = true;
        } else { // 「近接」した正解ノーツがない場合は，
          score += redundantPenalty;
        }
      }
    }
  }
  score = Math.max(0, score);
  score *= 100 / qNotes.length;

  return score;
};

const submitAnswer = (req, res) => {
  const data = req.body;
  let query;
  if (req.isAuthenticated()) {
    query = {
      text: 'SELECT * from questions WHERE id = $1 and uid != $2',
      values: [data.qid, req.user.id],
    };

    client.query(query)
      .then((result) => {
        const qNotes = result.rows[0].notes;
        const score = evaluateAnswer(qNotes, data.notes);

        query = {
          text: 'INSERT INTO answers(qid, uid, notes, score) VALUES($1, $2, $3, $4)',
          values: [data.qid, req.user.id, JSON.stringify(data.notes), score],
        };

        client.query(query)
          .then(() => res.send({
            score,
            saved: true,
            errState: 0,
          }))
          .catch((e) => {
            console.log(e);
            res.send({ errState: 1 });
          });
      })
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  } else {
    query = {
      text: 'SELECT * from questions WHERE id = $1',
      values: [data.qid],
    };

    client.query(query)
      .then((result) => {
        const qNotes = result.rows[0].notes;
        const score = evaluateAnswer(qNotes, data.notes);

        res.send({
          score,
          saved: false,
          errState: 0,
        });
      })
      .catch((e) => {
        console.log(e);
        res.send({ errState: 1 });
      });
  }
};

module.exports = submitAnswer;
