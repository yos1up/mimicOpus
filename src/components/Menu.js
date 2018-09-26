import React from "react";
import Tone from "tone";

//サンプラー
const sampler = new Tone.Sampler({
  "C2" : "C2.wav",
  "E2" : "E2.wav",
  "Ab2" : "Ab2.wav",
  "C3" : "C3.wav",
  "E3" : "E3.wav",
  "Ab3" : "Ab3.wav",
  "C4" : "C4.wav",
  "E4" : "E4.wav",
  "Ab4" : "Ab4.wav",
  "C5" : "C5.wav",
  "E5" : "E5.wav",
  "Ab5" : "Ab5.wav",
  "C6" : "C6.wav",
}, {
  'release': 1,
  'onload': function(){
    //sampler will repitch the closest sample
    sampler.toMaster();
    console.log("sampler successfully loaded!");
  },
  'baseUrl': "./instrument_piano/"
});
Tone.Transport.start();


function noteNumberToPitchName(nn){
  return ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][nn % 12] + (Math.floor(nn/12)-1);
}

var questionMelody = [];

class Menu extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      tb_bpm_disabled: false,
      b_set_as_question: false,
      b_play_question: true,
      b_submit: true,
    };

    this.handleClickSetAsQuestion = this.handleClickSetAsQuestion.bind(this);
  }

  handleClickSetAsQuestion(){
    questionMelody = [...this.props.notes.values()];
    this.props.clearNotes();

    this.setState({
      tb_bpm_disabled: true,
      b_set_as_question: true,
      b_play_question: false,
      b_submit: false,
    });
  }

  downloadData(jsonObject) { //作業状態のダウンロード
    var blob = new Blob([ JSON.stringify(jsonObject) ], { "type" : "text/json" });
    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "net.json");
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }
  }

  evaluateAnswer(qMel, aMel){
    /* 評価関数どうしますかね・・・

    Wasserstein距離？ 編集距離？ 重なりの面積？ 完全一致？ F-value? 音ゲー式？
    評価対象はノートオンのみ？

    qMel, aMel: ノーツオブジェクトを各要素にもつ array
                ノーツオブジェクト： {start:(ノートオン時刻[s]), end:(ノートオフ時刻[s]), pitch:(ノートナンバー)}
    */
    // 音ゲー式をまずは実装してみる．
    var qEventOfEachPitch = Array(128);
    for(let i=0;i<128;i++) qEventOfEachPitch[i] = new Array();
    var aEventOfEachPitch = Array(128);
    for(let i=0;i<128;i++) aEventOfEachPitch[i] = new Array();
    for(let e of qMel) qEventOfEachPitch[e.pitch].push(e.start);
    for(let e of aMel) aEventOfEachPitch[e.pitch].push(e.start);

    const redundantPenalty = -0.5; //[pt]
    const relevantInterval = 0.1; //[s]
    const scoreDecay = 0.1; //[s]
    var score = 0;

    for(let i=0;i<128;i++){ //ピッチごとに採点をする．
      if (qEventOfEachPitch[i].length == 0){
        score += redundantPenalty * aEventOfEachPitch[i].length;
        continue;
      }
      qEventOfEachPitch[i].sort();
      aEventOfEachPitch[i].sort();
      /*  回答の各ノーツを，時刻の早いものから順に見ていく．
          回答の各ノーツについて，
            その回答ノーツに「近接」した正解ノーツがある場合は
              それらの近接度に応じてスコアを加算し（同時なら満点），その正解ノーツを「削除」する．
            その回答ノーツに「近接」した正解ノーツがない場合は，
              スコアを減点する．
      */
      var check = Array(qEventOfEachPitch[i].length).fill(false);
      let qOffset = 0;
      for(let t of aEventOfEachPitch[i]){
        while(qOffset < qEventOfEachPitch[i].length && qEventOfEachPitch[i][qOffset] < t) qOffset++;

        let leftidx = qOffset - 1; // tの左側で，最も近接した「未チェックノート」との時間差
        while(leftidx >= 0 && check[leftidx]) leftidx--;
        let left = (leftidx >= 0) ? (t - qEventOfEachPitch[i][leftidx]) : Infinity;

        let rightidx = qOffset; // tの右側で，最も近接した「未チェックノート」との時間差
        while(rightidx < qEventOfEachPitch[i].length && check[rightidx]) rightidx++;
        let right = (rightidx < qEventOfEachPitch[i].length) ? (qEventOfEachPitch[i][rightidx] - t) : Infinity;

        let minDist = Math.min(left, right);
        console.log(minDist);
        if (minDist < relevantInterval){ //「近接」した正解ノーツがある場合は
          score += Math.exp(-minDist/scoreDecay);
          check[(left < right) ? leftidx : rightidx] = true;
        }else{ //「近接」した正解ノーツがない場合は，
          score += redundantPenalty;
        }
      }
    }
    score = Math.max(0, score);
    score *= 100 / qMel.length;

    var message = '';
    message += 'number of notes in the question: ' + qMel.length + '\n';
    message += 'number of notes in your answer: ' + aMel.length + '\n';
    message += 'YOUR SCORE: ' + score + '\n';
    if (score >= 100) message += '!!! CONGRATULATION !!!';
    window.alert(message);
  }

  play(notes, bpm=120){ //一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    //bpm 例外処理・・・
    var secPerBeat = 60 / bpm;
    var timeEventTupleList = [];
    for(let note of Object.values(notes)){
      timeEventTupleList.push([note.start * secPerBeat, [note.pitch, (note.end-note.start) * secPerBeat]]);
    }
    var melody = new Tone.Part(
      function(time, event){
        sampler.triggerAttackRelease(noteNumberToPitchName(event[0]), event[1], time, 1); // 引数は，おそらく (音高，音長，絶対時刻[s]，ベロシティ[0~1])
      }, timeEventTupleList);
    melody.start(Tone.now()); //先に Tone.Transport.start() してある必要がある．
  }

  render(){
    // inputはなぜか変なエラーが出るのでmaterial ui のボタンを使いましょう
    return(
      <div>
        <input
          type="button"
          id="b_show"
          value="play"
          onClick={() => this.play([...this.props.notes.values()], document.getElementById('tb_bpm').value)}
        />
        BPM =
        <input
          type="text"
          id="tb_bpm"
          size="3"
          disabled={this.state.tb_bpm_disabled}
          defaultValue={150}
        />
        <br />

        <input
          type="button"
          id="b_set_as_question"
          value="set as question"
          disabled={this.state.b_set_as_question}
          onClick={() => this.handleClickSetAsQuestion()}
        />
        <input
          type="button"
          id="b_play_question"
          value="play question"
          disabled={this.state.b_play_question}
          onClick={() => this.play(questionMelody, document.getElementById('tb_bpm').value)}
        />
        <input
          type="button"
          id="b_submit"
          value="submit"
          disabled={this.state.b_submit}
          onClick={() => this.evaluateAnswer(questionMelody, Object.values([...this.props.notes.values()]))}
        />
        <br />

        <a
          id="download"
          href="#"
          download="scoreData.json"
          onClick={() => this.downloadData(Object.values([...this.props.notes.values()]))}
        >
        save current state
        </a>
        <br />
      </div>
    );
  }
}

export default Menu;
