import Immutable from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import Tone from 'tone';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Slider from '@material-ui/lab/Slider';

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

let questionMelody = [];

class Menu extends React.Component {
  static evaluateAnswer(qMel, aMel) {
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
    for (let i = 0; i < qMel.length; i += 1) qEventOfEachPitch[qMel[i].pitch].push(qMel[i].start);
    for (let i = 0; i < aMel.length; i += 1) aEventOfEachPitch[aMel[i].pitch].push(aMel[i].start);

    const redundantPenalty = -0.5; // [pt]
    const relevantInterval = 0.1; // [s]
    const scoreDecay = 0.1; // [s]
    let score = 0;

    for (let i = 0; i < 128; i += 1) { // ピッチごとに採点をする．
      if (qEventOfEachPitch[i].length === 0) {
        score += redundantPenalty * aEventOfEachPitch[i].length;
      } else {
        qEventOfEachPitch[i].sort();
        aEventOfEachPitch[i].sort();
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
    score *= 100 / qMel.length;

    let message = '';
    message += `YOUR SCORE: ${score}\n`;
    if (score >= 100) message += '!!! CONGRATULATION !!!';
    window.alert(message); // TODO: Unexpected Alertなので代わりのものを実装
  }

  static play(notes, bpm = 120) { // 一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    // bpm 例外処理・・・
    const secPerBeat = 60 / bpm;
    const timeEventTupleList = [];
    for (let i = 0; i < Object.values(notes).length; i += 1) {
      const note = Object.values(notes)[i];
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

  constructor(props) {
    super(props);

    this.state = {
      enableSetAsQuestionBtn: true,
      enablePlayQuestionBtn: false,
      enableLoadAsQuestionBtn: true,
      enableSubmitBtn: false,
      bpm: 150,
    };

    this.handleClickSetAsQuestion = this.handleClickSetAsQuestion.bind(this);
    this.handleUploadOnChange = this.handleUploadOnChange.bind(this);
  }

  setAsQuestion(melodyArray) {
    const { clearNotes } = this.props;
    questionMelody = melodyArray;
    clearNotes();
    this.setState({
      enableSetAsQuestionBtn: false,
      enablePlayQuestionBtn: true,
      enableLoadAsQuestionBtn: false,
      enableSubmitBtn: true,
    });
  }

  downloadData(jsonObject) {
    // 作業状態のダウンロード
    const blob = new Blob([JSON.stringify(jsonObject)], { type: 'text/json' });
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, '_.json');
    } else {
      // TODO: もうちょっとうまいやり方ないかなあ
      const a = this.downloadAnchor;
      a.href = window.URL.createObjectURL(blob);
      a.download = 'scoreData.json';
      a.click();
    }
  }

  handleClickSetAsQuestion() {
    const { notes } = this.props;
    // 現在のエディタの状態を，問題にセットする．
    this.setAsQuestion([...notes.values()]);
  }

  handleClickLoadAsQuestion() {
    // ファイルを開くダイアログを出し，jsonを読んで，問題にセットする．
    this.uploadBtn.click();
  }

  handleUploadOnChange(e) {
    // 作業状態の読み込み
    const file = e.target.files;
    const reader = new FileReader();// FileReaderの作成
    if (typeof file[0] !== 'undefined') {
      reader.readAsText(file[0]);// テキスト形式で読み込む
      reader.onload = (() => {
        // 読込終了後の処理
        this.setAsQuestion(JSON.parse(reader.result));
      });
    }
  }

  render() {
    // TODO: Material UI
    const { notes } = this.props;
    const {
      enablePlayQuestionBtn,
      enableSetAsQuestionBtn,
      enableLoadAsQuestionBtn,
      enableSubmitBtn,
      bpm,
    } = this.state;

    return (
      <div>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          style={{ position: 'absolute', top: 10, left: 10 }}
          onClick={() => Menu.play([...notes.values()], bpm)}
        >
          <PlayArrowIcon />
        </Button>
        <Typography
          style={{ position: 'absolute', top: 10, left: 100 }}
        >
          BPM
          {bpm}
        </Typography>
        <Slider
          min={60}
          max={180}
          step={1}
          value={bpm}
          onChange={(e, v) => this.setState({ bpm: v })}
          style={{
            position: 'absolute',
            top: 25,
            left: 100,
            width: 200,
          }}
        />
        <br />


        <Button
          style={{ position: 'absolute', top: 60, left: 10 }}
          variant="contained"
          color="primary"
          disabled={!enableSetAsQuestionBtn}
          onClick={() => this.handleClickSetAsQuestion()}
        >
          set as question
        </Button>
        <Button
          style={{ position: 'absolute', top: 60, left: 180 }}
          variant="contained"
          color="primary"
          disabled={!enableLoadAsQuestionBtn}
          onClick={() => this.handleClickLoadAsQuestion()}
        >
          load .json as question
        </Button>
        <Button
          style={{ position: 'absolute', top: 60, left: 400 }}
          variant="contained"
          color="primary"
          disabled={!enablePlayQuestionBtn}
          onClick={() => Menu.play(questionMelody, bpm)}
        >
          play question
        </Button>
        <Button
          style={{ position: 'absolute', top: 60, left: 560 }}
          variant="contained"
          color="primary"
          disabled={!enableSubmitBtn}
          onClick={() => Menu.evaluateAnswer(questionMelody, Object.values([...notes.values()]))}
        >
          submit
        </Button>
        <br />
        <Button
          style={{ position: 'absolute', top: 110, left: 10 }}
          variant="contained"
          color="primary"
          id="download"
          href="#"
          download="scoreData.json"
          onClick={() => Menu.downloadData(Object.values([...notes.values()]))}
        >
          save current state
        </Button>
        <input
          type="file"
          ref={(uploadBtn) => { this.uploadBtn = uploadBtn; }}
          id="b_upload"
          onChange={this.handleUploadOnChange}
          hidden
        />
        <a
          id="a_download"
          ref={(downloadAnchor) => { this.downloadAnchor = downloadAnchor; }}
          hidden
        />
        <br />
      </div>
    );
  }
}

Menu.propTypes = {
  clearNotes: PropTypes.func.isRequired,
  notes: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default Menu;
