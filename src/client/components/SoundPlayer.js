import Tone from 'tone';

class SoundPlayer {
  constructor(updateInterval = 50, onChangeBeats = () => {}) {
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
    this.lastPlayStarted = 0;

    this.melody = null;
    this.startBeat = null;

    this.interval = null;
    this.onChangeBeats = onChangeBeats;
    this.updateInterval = updateInterval;
  }

  static noteNumberToPitchName(nn) {
    return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][nn % 12] + (Math.floor(nn / 12) - 1);
  }

  play(notes, bpm = 120, startBeat = 0) { // 一連の音符たちを鳴らしたい場合
    /*
      notes: 1-d Array of noteObject
        noteObject: { pitch, start, end, }
    */
    this.bpm = bpm;
    this.secPerBeat = 60 / bpm;
    if (Number.isNaN(this.secPerBeat)) this.secPerBeat = 60 / 120.0;
    const timeEventTupleList = [];
    for (let i = 0; i < notes.size; i += 1) {
      const note = notes.get(i);

      if (note.start >= startBeat) {
        timeEventTupleList.push(
          [(note.start - startBeat) * this.secPerBeat,
            [note.pitch, (note.end - note.start) * this.secPerBeat]],
        );
      }
    }
    if (this.melody !== null) {
      this.melody.stop();
    }
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.onChangeBeats(0);
    }

    // 一連の音符たちを鳴らしたい場合，このように Tone.Part が便利．（他に Tone.Sequence というのもあるようだ）
    this.melody = new Tone.Part(
      (time, event) => {
        this.sampler.triggerAttackRelease(
          SoundPlayer.noteNumberToPitchName(event[0]), event[1], time, 1,
        ); // 引数は (音高，音長，絶対時刻[s]，ベロシティ[0~1])
      }, timeEventTupleList,
    );
    this.startBeat = startBeat;
    this.melody.start(Tone.now()); // これよりも先に Tone.Transport.start() してある必要がある．
    this.lastPlayStarted = Tone.now();
    this.interval = setInterval(this.updateBeats.bind(this), 50);
  }

  stop() {
    if (this.melody !== null) {
      this.melody.stop();
      this.melody = null;
    }
    if (this.startBeat !== null) {
      this.startBeat = null;
    }
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.onChangeBeats(null);
    }
  }

  updateBeats() {
    let beats;
    if (typeof this.secPerBeat === 'undefined') {
      beats = null;
    } else if (this.melody === null) {
      beats = null;
    } else {
      beats = (Tone.now() - this.lastPlayStarted) / this.secPerBeat + this.startBeat;
    }
    this.onChangeBeats(beats);
  }

  preview(pitch) { // とりあえず一音だけ即時に鳴らしたい場合はこちらをどうぞ
    /* pitch<int>: 0--127 */
    this.sampler.triggerAttackRelease(SoundPlayer.noteNumberToPitchName(pitch), '4n');
  }
}


export default SoundPlayer;
