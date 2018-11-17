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
    this.context = new AudioContext();
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
    let pianoWaves = new Array(128);

    const promises = Object.entries(urls).map((item) => {
      const [pitch, url] = item;
      const promise = new Promise(resolve => readWav(url, this.context, (audioBuffer) => {
        pianoWaves[pitchToNumber[pitch]] = [
          audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];
        resolve(pitch);
      }));
      return promise;
    });

    Promise.all(promises).then(() => {
      pianoWaves = SoundPlayer.interpolationWaves(pianoWaves);
    });
  }

  preview(pitch) { // とりあえず一音だけ即時に鳴らしたい場合はこちらをどうぞ
    /* pitch<int>: 0--127 */
    // this.sampler.triggerAttackRelease(SoundPlayer.noteNumberToPitchName(pitch), '4n');
  }
}


export default SoundPlayer;
