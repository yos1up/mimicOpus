import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router';

import displayModes from '../../data/displayModes';

import SoundPlayer from '../SoundPlayer';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.soundPlayer = new SoundPlayer();
    this.state = {
      width: null,
      height: null,
    };
  }

  componentDidMount() {
    const { loadNewQuestionsList, loadOsusumeQuestionsList, changeDisplayMode } = this.props;
    loadNewQuestionsList();
    loadOsusumeQuestionsList();
    changeDisplayMode(displayModes.HOME);

    this.setState({
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,
    });
  }

  render() {
    const {
      newQuestionsList, osusumeQuestionsList, history,
    } = this.props;
    const {
      width,
    } = this.state;
    return (
      <div
        id="Home"
        style={{
          width: '100%',
          margin: 10,
        }}
        ref={(element) => { this.element = element; }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>mimicOpus「耳コピ」はあなたの音楽をより良くする</title>
        </Helmet>
        <img
          src="./images/logo_transparent.png"
          alt=""
          style={{
            position: 'absolute',
            width: 64,
            height: 64,
            top: 0,
            left: 0,
          }}
        />
        <div>
          <Typography
            variant="h6"
            color="textPrimary"
            style={{
              position: 'absolute',
              top: 0,
              left: 70,
              width: width - 70,
            }}
          >
            「耳コピ」はあなたの音楽をより良くする
          </Typography>
          <Typography
            variant="h7"
            color="textPrimary"
            style={{
              position: 'absolute', top: 70, width: width - 20,
            }}
          >
            mimicOpus(ミミックオーパス)は「耳コピ」のスキルアップのためのオンラインサービスです。
            <br />
            みんなが作った曲を耳コピして、ハイスコアを目指しましょう。
            <br />
            また、サインインをすることで、自分で問題を作ったり、レーティングを表示することができます。
            <br />
            ※mimicOpusは現在スマホ対応中です。
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
  changeDisplayMode: PropTypes.func.isRequired,
};

export default withRouter(Home);
