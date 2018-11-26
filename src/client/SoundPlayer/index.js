import readWav from './readWav';
import pitchToNumber from './pitchToNumber';

window.AudioContext = window.AudioContext || window.webkitAudioContext;


class SoundPlayer {
  static resample(x, num) {
    // xを長さnumのarrayにresampleする関数（基本的にピッチシフトに使う）
    const y = new Float32Array(num);
    for (let i = 0; i < num; i += 1) {
      const oldI = i * x.length / num;
      if (oldI < 0.5) {
        y[i] = oldI * x[1] - x[0] * (oldI - 1);
      } else if (x.length - 1.5 <= oldI) {
        y[i] = -(oldI - (x.length - 1)) * x[x.length - 2]
          + x[x.length - 1] * ((oldI - (x.length - 1)) + 1);
      } else {
        const roundedOldI = parseInt(Math.round(oldI), 10);
        const normalizedOldI = oldI - roundedOldI;
        y[i] = normalizedOldI * x[roundedOldI - 1] * (normalizedOldI - 1) / 2
          - x[roundedOldI] * ((normalizedOldI ** 2) - 1)
          + normalizedOldI * x[roundedOldI + 1] * (normalizedOldI + 1) / 2;
      }
    }
    return y;
  }

  static interpolationWaves(waves) {
    // 全てのpitchのwaveをあらかじめ作っておく
    const existId = [];
    for (let i = 0; i < waves.length; i += 1) {
      if (waves[i] !== undefined) {
        existId.push(i);
      }
    }
    for (let i = 0; i < waves.length; i += 1) {
      if (waves[i] === undefined) {
        let argmin = 0;
        for (let j = 0; j < existId.length; j += 1) {
          if (Math.abs(existId[argmin] - i) > Math.abs(existId[j] - i)) {
            argmin = j;
          }
        }
        const neighbor = existId[argmin];
        waves[i] = waves[neighbor].map(
          wave => SoundPlayer.resample(
            wave, parseInt(wave.length * Math.pow(2, (neighbor - i) / 12), 10)));
      }
    }
    return waves;
  }

  static noteNumberToPitchName(nn) {
    return ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'][nn % 12] + (Math.floor(nn / 12) - 1);
  }

  constructor(updateInterval = 50, onChangeBeats = () => {}) {
    // 最初の読み込みに時間がかかってしまう
    // まず考えられるのは、アプリ自体の起動の最初だけこの処理をすることである
    // あとはWebAssemblyとかである
    this.context = new window.AudioContext();
    const urls = {
      C2: './instrument_piano/C2.wav',
      E2: './instrument_piano/E2.wav',
      Ab2: './instrument_piano/Ab2.wav',
      C3: './instrument_piano/C3.wav',
      E3: './instrument_piano/E3.wav',
      Ab3: './instrument_piano/Ab3.wav',
      C4: './instrument_piano/C4.wav',
      E4: './instrument_piano/E4.wav',
      Ab4: './instrument_piano/Ab4.wav',
      C5: './instrument_piano/C5.wav',
      E5: './instrument_piano/E5.wav',
      Ab5: './instrument_piano/Ab5.wav',
      C6: './instrument_piano/C6.wav',
    };
    this.pianoWaves = new Array(128);
    this.pianoBufers = new Array(128);

    const promises = Object.entries(urls).map((item) => {
      const [pitch, url] = item;
      const promise = new Promise(resolve => readWav(url, this.context, (audioBuffer) => {
        this.pianoWaves[pitchToNumber[pitch]] = [
          audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];
        resolve(pitch);
      }));
      return promise;
    });

    Promise.all(promises).then(() => {
      this.pianoWaves = SoundPlayer.interpolationWaves(this.pianoWaves);
      this.pianoBufers = this.pianoWaves.map(
        (waves) => {
          const buffer = this.context.createBuffer(2, waves[0].length, this.context.sampleRate);
          const zeroChannelData = buffer.getChannelData(0);
          for (let i = 0; i < zeroChannelData.length; i += 1) {
            zeroChannelData[i] = waves[0][i];
          }
          const oneChannelData = buffer.getChannelData(1);
          for (let i = 0; i < zeroChannelData.length; i += 1) {
            oneChannelData[i] = waves[1][i];
          }
          return buffer;
        }
      );
    });

    this.lastPlayStarted = null;
    this.melody = null;
    this.startBeat = null;

    this.interval = null;
    this.onChangeBeats = onChangeBeats;
    this.updateInterval = updateInterval;
  }

  play(notes, bpm = 120, startBeat = 0) { // 一連の音符たちを鳴らしたい場合
    /*
      notes: 1-d Array of noteObject
        noteObject: { pitch, start, end, }
    */
    this.bpm = bpm;
    this.secPerBeat = 60 / bpm;
    if (Number.isNaN(this.secPerBeat)) this.secPerBeat = 60 / 120.0;

    if (this.melody !== null) {
      for (let i = 0; i < this.melody.size; i += 1) {
        const source = this.melody[i];
        source.disconnect();
      }
    }
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.onChangeBeats(0);
    }


    if (true) {
      // ここが音声合成をしてから再生するところ
      this.melody = [];

      const fullsize = parseInt(
        this.context.sampleRate * this.secPerBeat * 16, 10
      );
      const bufferSize = parseInt(
        this.context.sampleRate * this.secPerBeat * (16 - startBeat), 10
      );
      const sizeDiff = fullsize - bufferSize;
      const melodyBuffer = this.context.createBuffer(
        2, bufferSize, this.context.sampleRate
      );

      const zeroChannelData = melodyBuffer.getChannelData(0);
      const oneChannelData = melodyBuffer.getChannelData(1);
      for (let i = 0; i < notes.size; i += 1) {
        const note = notes.get(i);

        const start = parseInt(this.context.sampleRate * note.start * this.secPerBeat, 10);
        let stop = fullsize;
        stop = Math.min(stop, parseInt(this.context.sampleRate * note.end * this.secPerBeat, 10));
        stop = Math.min(stop, start + this.pianoWaves[note.pitch][0].length);

        for (let t = start; t < stop; t += 1) {
          if (t >= sizeDiff) {
            zeroChannelData[t - sizeDiff] += this.pianoWaves[note.pitch][0][t - start];
            oneChannelData[t - sizeDiff] += this.pianoWaves[note.pitch][1][t - start];
          }
        }
      }

      this.startBeat = startBeat;
      this.lastPlayStarted = this.context.currentTime;

      const source = this.context.createBufferSource();
      source.buffer = melodyBuffer;
      source.connect(this.context.destination);
      source.start(this.lastPlayStarted);
      source.stop(this.lastPlayStarted + (16 - this.startBeat) * this.secPerBeat);
      this.melody.push(source);
    } else {
      // こっちが従来通りのやつ
      this.startBeat = startBeat;
      this.lastPlayStarted = this.context.currentTime;
      this.melody = [];
      for (let i = 0; i < notes.size; i += 1) {
        const note = notes.get(i);

        if (note.start >= startBeat) {
          const source = this.context.createBufferSource();
          const start = this.lastPlayStarted + (note.start - startBeat) * this.secPerBeat;
          const stop = this.lastPlayStarted + (note.end - startBeat) * this.secPerBeat;
          source.buffer = this.pianoBufers[note.pitch];
          source.connect(this.context.destination);
          source.start(start);
          source.stop(stop);
          this.melody.push(source);
        }
      }
    }

    this.interval = setInterval(this.updateBeats.bind(this), 50);
  }

  stop() {
    if (this.melody !== null) {
      for (let i = 0; i < this.melody.length; i += 1) {
        const source = this.melody[i];
        source.disconnect();
      }
    }
    this.melody = null;
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
      beats = (this.context.currentTime - this.lastPlayStarted) / this.secPerBeat + this.startBeat;
    }
    this.onChangeBeats(beats);
  }

  preview(pitch) { // とりあえず一音だけ即時に鳴らしたい場合はこちらをどうぞ
    /* pitch<int>: 0--127 */
    const source = this.context.createBufferSource();
    source.buffer = this.pianoBufers[pitch];
    source.connect(this.context.destination);
    source.start(this.context.currentTime);
    source.stop(this.context.currentTime + 1);
  }
}


export default SoundPlayer;
