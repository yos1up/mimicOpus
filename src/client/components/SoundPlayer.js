import Tone from 'tone';

class SoundPlayer {
  constructor() {
    // サンプラー
    this.sampler = new Tone.Sampler({
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
        this.sampler.toMaster();
        // console.log('sampler successfully loaded!');
      },
      baseUrl: './instrument_piano/',
    });
    Tone.Transport.start();
  }

  static noteNumberToPitchName(nn) {
    return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][nn % 12] + (Math.floor(nn / 12) - 1);
  }

  play(notes, bpm = 120) { // 一連の音符たちを鳴らしたい場合，Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    /*
      notes: 1-d Array of noteObject
        noteObject: { pitch, start, end, }
    */
    let secPerBeat = 60 / bpm;
    if (Number.isNaN(secPerBeat)) secPerBeat = 1 / 120.0;
    const timeEventTupleList = [];
    for (let i = 0; i < notes.size; i += 1) {
      const note = notes.get(i);
      timeEventTupleList.push(
        [note.start * secPerBeat, [note.pitch, (note.end - note.start) * secPerBeat]],
      );
    }
    const melody = new Tone.Part(
      (time, event) => {
        this.sampler.triggerAttackRelease(
          SoundPlayer.noteNumberToPitchName(event[0]), event[1], time, 1,
        ); // 引数は，おそらく (音高，音長，絶対時刻[s]，ベロシティ[0~1])
      }, timeEventTupleList,
    );
    melody.start(Tone.now()); // 先に Tone.Transport.start() してある必要がある．
  }

  preview(pitch) {
    this.sampler.triggerAttackRelease(pitch, '4n');
  }
}


export default SoundPlayer;
