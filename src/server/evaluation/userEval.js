const userEval = (ratings, scores) => {
  const ratingScores = [];
  for (let i = 0; i < ratings.length; i += 1) {
    ratingScores.push(ratings[i] * scores[i] / 100);
  }

  let l5Norm = 0;
  for (let i = 0; i < ratingScores.length; i += 1) {
    if (ratingScores[i] > 0) {
      l5Norm += (ratingScores[i] / 1000) ** 5;
    }
  }
  l5Norm = (l5Norm ** 0.2) * 1000;

  return l5Norm;
};


module.exports = userEval;
