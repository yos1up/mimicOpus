import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import displayModes from '../../data/displayModes';

// サンプラー
const sampler = new Tone.Sampler({
  C2: 'C2.wav',
  E2: 'E2.wav',
  Ab2: 'Ab2.wav',
  C3: 'C3.wav',
  E3: 'E3.wav',
  Ab3: 'Ab3.wav',
  C4: 'C4.wav',
  E4: 'E4.wav',
  Ab4: 'Ab4.wav',
  C5: 'C5.wav',
  E5: 'E5.wav',
  Ab5: 'Ab5.wav',
  C6: 'C6.wav',
}, {
  release: 1,
  onload: () => {
    // sampler will repitch the closest sample
    sampler.toMaster();
    // console.log('sampler successfully loaded!');
  },
  baseUrl: './instrument_piano/',
});
Tone.Transport.start();

function noteNumberToPitchName(nn) {
  return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][nn % 12] + (Math.floor(nn / 12) - 1);
}

function play(notes, bpm = 120) { // 一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
  // bpm 例外処理・・・
  const secPerBeat = 60 / bpm;
  const timeEventTupleList = [];
  for (let i = 0; i < notes.size; i += 1) {
    const note = notes.get(i);
    timeEventTupleList.push(
      [note.start * secPerBeat, [note.pitch, (note.end - note.start) * secPerBeat]],
    );
  }
  const melody = new Tone.Part(
    (time, event) => {
      sampler.triggerAttackRelease(
        noteNumberToPitchName(event[0]), event[1], time, 1,
      ); // 引数は，おそらく (音高，音長，絶対時刻[s]，ベロシティ[0~1])
    }, timeEventTupleList,
  );
  melody.start(Tone.now()); // 先に Tone.Transport.start() してある必要がある．
}

class Home extends React.Component {
  componentDidMount() {
    const { loadNewQuestionsList, loadOsusumeQuestionsList } = this.props;
    loadNewQuestionsList();
    loadOsusumeQuestionsList();
  }

  render() {
    const {
      newQuestionsList, osusumeQuestionsList, setQuestion, setBPM, setQuestionId, changeDisplayMode
    } = this.props;
    console.log(osusumeQuestionsList);
    return (
      <div id="Home">
        <div>
          <Typography
            variant="h6"
            color="textPrimary"
            style={{
              position: 'absolute', top: 0, left: 10, width: 500,
            }}
          >
            mimicopus
          </Typography>
          <Typography
            color="textPrimary"
            style={{
              position: 'absolute', top: 30, left: 10, width: 1000,
            }}
          >
            mimicopus は「耳コピ」のスキルアップのためのオンラインサービスです。
            <br />
            他のユーザーが作ったピアノの曲を耳コピして，高スコアを目指しましょう（その場で自動採点されます）。
            <br />
            また、サインインをすることで、自分で作曲した曲を他のユーザーに耳コピしてもらったり，
            <br />
            耳コピのスキルを数値化したレーティングを表示することができます．
            <br />
            <br />

            このWebサービスはオープンソースで開発されていて、デベロッパーを歓迎します。
          </Typography>
        </div>
        <div
          id="Osusume Questions"
          style={{
            position: 'absolute', top: 200,
          }}
        >
          <Typography
            variant="h5"
            color="textPrimary"
            style={{
              position: 'absolute', top: 0, left: 10, width: 500,
            }}
          >
            おすすめ問題
          </Typography>
          {
            [...osusumeQuestionsList].map((item, i) => {
              const { id, question } = item;
              return (
                <Card
                  style={{
                    position: 'absolute',
                    width: 240,
                    left: 250 * i,
                    height: 150,
                    top: 50,
                  }}
                  onClick={() => {
                    setQuestion(question);
                    setBPM(question.bpm);
                    setQuestionId(id);
                    changeDisplayMode(displayModes.PLAY_QUESTION);
                  }}
                >
                  <CardActionArea style={{ width: '100%', height: '100%' }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        color="textSecondary"
                        style={{
                          position: 'absolute', top: 20, left: 30, width: 200,
                        }}
                      >
                        {question.title}
                      </Typography>
                      <IconButton
                        aria-label="Play"
                        style={{
                          position: 'absolute', left: 90, top: 70, width: 50, height: 50,
                        }}
                        onClick={(e) => {
                          play(question.notes, question.bpm);
                          e.stopPropagation();
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })
          }
        </div>
        <div
          id="New Questions"
          style={{
            position: 'absolute', top: 500,
          }}
        >
          <Typography
            variant="h5"
            color="textPrimary"
            style={{
              position: 'absolute', top: 0, left: 10, width: 500,
            }}
          >
            新しい問題
          </Typography>
          {
            [...newQuestionsList].map((item, i) => {
              const { id, question } = item;
              return (
                <Card
                  style={{
                    position: 'absolute',
                    width: 240,
                    left: 250 * i,
                    height: 150,
                    top: 50,
                  }}
                  onClick={() => {
                    setQuestion(question);
                    setBPM(question.bpm);
                    setQuestionId(id);
                    changeDisplayMode(displayModes.PLAY_QUESTION);
                  }}
                >
                  <CardActionArea style={{ width: '100%', height: '100%' }}>
                    <CardContent>
                      <Typography
                        variant="h5"
                        color="textSecondary"
                        style={{
                          position: 'absolute', top: 20, left: 30, width: 200,
                        }}
                      >
                        {question.title}
                      </Typography>
                      <IconButton
                        aria-label="Play"
                        style={{
                          position: 'absolute', left: 90, top: 70, width: 50, height: 50,
                        }}
                        onClick={(e) => {
                          play(question.notes, question.bpm);
                          e.stopPropagation();
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })
          }
        </div>
      </div>
    );
  }
}

Home.propTypes = {
  newQuestionsList: PropTypes.instanceOf(Immutable.List).isRequired,
  osusumeQuestionsList: PropTypes.instanceOf(Immutable.List).isRequired,
  loadNewQuestionsList: PropTypes.func.isRequired,
  loadOsusumeQuestionsList: PropTypes.func.isRequired,
  setQuestion: PropTypes.func.isRequired,
  setBPM: PropTypes.func.isRequired,
  setQuestionId: PropTypes.func.isRequired,
  changeDisplayMode: PropTypes.func.isRequired,
};

export default Home;
