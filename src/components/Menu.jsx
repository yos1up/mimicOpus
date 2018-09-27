import React from 'react';
import Tone from 'tone';

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
  static downloadData(jsonObject) {
    // 作業状態のダウンロード
    const blob = new Blob([JSON.stringify(jsonObject)], { type: 'text/json' });
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, '_.json');
    } else {
      const a = document.getElementById('a_download');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'scoreData.json';
      a.click();
    }
  }

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
        continue;
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
    window.alert(message); // TODO: Unexpected Alert
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
      tb_bpm: true,
      b_set_as_question: true,
      b_play_question: false,
      b_load_as_question: true,
      b_submit: false,
    };

    this.handleClickSetAsQuestion = this.handleClickSetAsQuestion.bind(this);
  }

  setAsQuestion(melodyArray){
    questionMelody = melodyArray;
    this.props.clearNotes();
    this.setState({
      tb_bpm: false,
      b_set_as_question: false,
      b_play_question: true,
      b_load_as_question: false,
      b_submit: true,
    });
  }

  handleClickSetAsQuestion(){
    //現在のエディタの状態を，問題にセットする．
    this.setAsQuestion([...this.props.notes.values()]);
  }
  handleClickLoadAsQuestion(){
    //ファイルを開くダイアログを出し，jsonを読んで，問題にセットする．
    document.getElementById('b_upload').click();
  }


  render() {
    // TODO: Material UI
    const { notes } = this.props;
    const { b_play_question, b_set_as_question, b_load_as_question, b_submit, tb_bpm} = this.state;
    return (
      <div>
        <input
          type="button"
          id="b_show"
          value="play"
          onClick={() => Menu.play([...notes.values()], document.getElementById('tb_bpm').value)}
        />
        BPM =
        <input
          type="text"
          id="tb_bpm"
          size="3"
          disabled={!tb_bpm}
          defaultValue={150}
        />
        <br />

        <input
          type="button"
          id="b_set_as_question"
          value="set as question"
          disabled={!b_set_as_question}
          onClick={() => this.handleClickSetAsQuestion()}
        />
        <input
          type="button"
          id="b_load_as_question"
          value="load .json as question"
          disabled={!b_load_as_question}
          onClick={() => this.handleClickLoadAsQuestion()}
        />
        <input
          type="button"
          id="b_play_question"
          value="play question"
          disabled={!b_play_question}
          onClick={() => Menu.play(questionMelody, document.getElementById('tb_bpm').value)}
        />
        <input
          type="button"
          id="b_submit"
          value="submit"
          disabled={!b_submit}
          onClick={() => Menu.evaluateAnswer(questionMelody, Object.values([...notes.values()]))}
        />
        <br />
        <button
          type="button"
          id="download"
          href="#"
          download="scoreData.json"
          onClick={() => Menu.downloadData(Object.values([...notes.values()]))}
        >
          save current state
        </button>
        <input
          type="file"
          id="b_upload"
          hidden
        />
        <a
          id="a_download"
          hidden
        />
        <br />
      </div>
    );
  }

  componentDidMount(){
    document.getElementById("b_upload").addEventListener("change",function(e){ //作業状態の読み込み
      var file = e.target.files;
      var reader = new FileReader();　//FileReaderの作成
      if (typeof file[0] !== 'undefined'){
        reader.readAsText(file[0]);　//テキスト形式で読み込む
        reader.onload = function(e){//読込終了後の処理
          this.setAsQuestion(JSON.parse(reader.result));
        }.bind(this);
      }
    }.bind(this),false);
  }

}

export default Menu;
