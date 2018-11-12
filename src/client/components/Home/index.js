import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router';

import displayModes from '../../data/displayModes';

import SoundPlayer from '../SoundPlayer';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.soundPlayer = new SoundPlayer();
  }

  componentDidMount() {
    const { loadNewQuestionsList, loadOsusumeQuestionsList, changeDisplayMode } = this.props;
    loadNewQuestionsList();
    loadOsusumeQuestionsList();
    changeDisplayMode(displayModes.HOME);
  }

  render() {
    const {
      newQuestionsList, osusumeQuestionsList, setQuestion, setBPM, setQuestionId, history,
    } = this.props;
    return (
      <div
        id="Home"
        style={{
          width: 1000,
          height: 730,
          backgroundColor: '#FFFFFF',
          padding: 30,
        }}
      >
        <img
          src="./images/score.jpg"
          alt=""
          style={{
            position: 'absolute',
            width: 1060,
            height: 790,
            top: 0,
            left: 0,
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 770,
            height: 790,
            top: 0,
            left: 0,
            background: '#FFFFFF',
          }}
        />
        <div>
          <Typography
            variant="h4"
            color="textPrimary"
            style={{
              position: 'absolute', top: 20, width: 700,
            }}
          >
            「耳コピ」はあなたの音楽をより良くする
          </Typography>
          <Typography
            variant="h7"
            color="textPrimary"
            style={{
              position: 'absolute', top: 80, width: 800,
            }}
          >
            mimicopus(ミミックオーパス)は「耳コピ」のスキルアップのためのオンラインサービスです。
            <br />
            みんなが作った曲を耳コピして、ハイスコアを目指しましょう。
            <br />
            また、サインインをすることで、自分で問題を作ったり、レーティングを表示することができます。
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
                    history.push('/playquestion');
                  }}
                >
                  <Tooltip title={`${question.title}を解く`}>
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
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                  <Tooltip title={`${question.title}を再生`}>
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
                  </Tooltip>
                </Card>
              );
            })
          }
        </div>
        <div
          id="New Questions"
          style={{
            position: 'absolute', top: 450,
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
                    history.push('/playquestion');
                  }}
                >
                  <Tooltip title={`${question.title}を解く`}>
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
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                  <Tooltip title={`${question.title}を再生`}>
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
                  </Tooltip>
                </Card>
              );
            })
          }
        </div>
        <div>
          <Typography
            variant="body1"
            color="textPrimary"
            style={{
              position: 'absolute', top: 700, width: 800,
            }}
          >
            mimicopusはAlpha Versionとなっております。
            <br />
            何かバグや機能リクエストがあればyos1up(
            <a href="https://twitter.com/yos1up">twitter</a>
            )またはmarshi(
            <a href="https://twitter.com/jokermarshi">twitter</a>
            )までご連絡していただければ、助かります。
            <br />
            このWebサービスはオープンソースで開発されていて、デベロッパーを歓迎します。(
            <a href="https://github.com/yos1up/mimicOpus">github</a>
            )
          </Typography>
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

export default withRouter(Home);
