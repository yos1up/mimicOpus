const questionEval = (notes, bpm) => {
  const isBlack = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0];
  const starts = notes.map(item => item.start);
  const pitchs = notes.map(item => item.pitch);

  const maxNotesPerSec = Math.max(
    ...Array.from(Array(4), (v, k) => k).map(
      i => starts.map(start => (parseInt(start / 4, 10) === i) * 1.0)
        .reduce((prev, current) => (prev + current), 0)
    )
  ) / 4 * bpm / 60;

  const numNotes = notes.length;

  const blackRate = pitchs.map(pitch => isBlack[pitch % 12])
    .reduce((prev, current) => (prev + current)) / numNotes;

  const maxSameTime = Math.max(
    ...Array.from(new Set(starts)).map(
      start1 => starts.map(start2 => (start1 === start2) * 1)
        .reduce((prev, current) => (prev + current))
    )
  );

  const maxSameTimeIsOne = (maxSameTime <= 1) * 1;
  const maxSameTimeIsTwo = (maxSameTime === 2) * 1;

  const sameTimingInFifth = Array.from(new Set(starts)).map(
    start => (
      starts2 => Array.from(Array(starts2.length - 1), (v, k) => k).map(
        i => starts2[i + 1] - starts2[i]
      )
    )(notes.filter(note => note.start === start)
      .map(note => note.pitch)
      .sort((a, b) => a - b))
      .map(diff => (diff <= 7) * 1)
      .reduce((prev, current) => (prev + current), 0)
  ).reduce((prev, current) => (prev + current), 0);
  return 133.80417775 * Math.log1p(maxNotesPerSec)
    + 143.61577783 * Math.log1p(numNotes)
    + 240.97427476 * blackRate
    - 275.34924477 * maxSameTimeIsOne
    - 28.83976109 * maxSameTimeIsTwo
    + 52.57385742 * Math.log1p(sameTimingInFifth)
    - 260.56840522643415;
};


module.exports = questionEval;
