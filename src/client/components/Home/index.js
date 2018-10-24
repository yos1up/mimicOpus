import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import displayModes from '../../data/displayModes';

import SoundPlayer from '../SoundPlayer';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.soundPlayer = new SoundPlayer();
  }

  componentDidMount() {
    const { loadNewQuestionsList, loadOsusumeQuestionsList } = this.props;
    loadNewQuestionsList();
    loadOsusumeQuestionsList();
  }

  render() {
    const {
      newQuestionsList, osusumeQuestionsList, setQuestion, setBPM, setQuestionId, changeDisplayMode
    } = this.props;
    return (
      <div id="Home">
        {/* <img
          src="./images/piano.jpg"
          alt=""
          style={{
            width:1000,
          }}
        /> */}
        <div>
          <Typography
            variant="h4"
            color="textPrimary"
            style={{
              position: 'absolute', top: 10, left: 10, width: 500,
            }}
          >
            誰でも耳コピ
          </Typography>
          <Typography
            variant="h7"
            color="textPrimary"
            style={{
              position: 'absolute', top: 80, left: 10, width: 800,
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
            mimicopusはAlpha Versionとなっております。
            <br />
            何かバグや機能リクエストがあればyos1up(
            <a href="https://twitter.com/yos1up">twitter</a>
            )またはmarshi(
            <a href="https://twitter.com/jokermarshi">twitter</a>
            )までご連絡していただければ、助かります。
            <br />
            <br />

            このWebサービスはオープンソースで開発されていて、デベロッパーを歓迎します。(
            <a href="https://github.com/yos1up/mimicOpus">github</a>
            )
          </Typography>
        </div>
        <div
          id="Osusume Questions"
          style={{
            position: 'absolute', top: 370,
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
                          this.soundPlayer.play(question.notes, question.bpm);
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
            position: 'absolute', top: 600,
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
                          this.soundPlayer.play(question.notes, question.bpm);
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
