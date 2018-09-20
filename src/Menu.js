import React from "react";
import Tone from "Tone";
import scoreData from "./scoreData";

//サンプラー
var sampler = new Tone.Sampler({
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

function play(notes, bpm=120){ //一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
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

var questionMelody = [];
function setAsQuestion(){
  questionMelody = Object.values(scoreData.notes.items()).concat(); //.concat() は値コピーのため．
  scoreData.clearNotes();
  //bpmを変更不可能にする
  document.getElementById('tb_bpm').disabled = true;
  //set as question ボタンを不能にする
  document.getElementById('b_set_as_question').disabled = true;
  //play question ボタンを不能にする
  document.getElementById('b_play_question').disabled = false;
  //submit ボタンを有効にする
  document.getElementById('b_submit').disabled = false;
}

function evaluateAnswer(qMel, aMel){
  /* 評価関数どうしますかね・・・

  Wasserstein距離？ 編集距離？ 重なりの面積？ 完全一致？ F-value?
  評価対象はノートオンのみ？
  */
  var message = '';
  message += 'number of notes in the question: ' + qMel.length + '\n';
  message += 'number of notes in your answer: ' + aMel.length + '\n';
  message += 'YOUR SCORE: 0';
  window.alert(message);
}

function downloadData(jsonObject) { //作業状態のダウンロード
  var blob = new Blob([ JSON.stringify(jsonObject) ], { "type" : "text/json" });
  if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, "net.json");
  } else {
      document.getElementById("download").href = window.URL.createObjectURL(blob);
  }
}

class Menu extends React.Component {
  render(){
    // inputはなぜか変なエラーが出るのでmaterial ui のボタンを使いましょう
    return(
      <div>
        <input
          type="button"
          id="b_show"
          value="play"
          onClick={() => play(scoreData.notes.items(), document.getElementById('tb_bpm').value)}
        />
        BPM =
        <input
          type="text"
          id="tb_bpm"
          size="3"
          defaultValue={150}
        />
        <br />

        <input
          type="button"
          id="b_set_as_question"
          value="set as question"
          onClick={() => setAsQuestion()}
        />
        <input
          type="button"
          id="b_play_question"
          value="play question"
          disabled
          onClick={() => play(questionMelody, document.getElementById('tb_bpm').value)}
        />
        <input
          type="button"
          id="b_submit"
          value="submit"
          disabled
          onClick={() => evaluateAnswer(questionMelody, Object.values(scoreData.notes.items()))}
        />
        <br />

        <a
          id="download"
          href="#"
          download="scoreData.json"
          onClick={() => downloadData(Object.values(scoreData.notes.items()))}
        >
        save current state
        </a>
        <br />
      </div>
    );
  }
}

export default Menu;
