function readWav(url, context, onSuccess = () => {}) {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    if (xhr.status === 200) {
      const arrayBuffer = xhr.response;
      if (arrayBuffer instanceof ArrayBuffer) {
        const successCallback = (audioBuffer) => {
          onSuccess(audioBuffer);
        };
        context.decodeAudioData(arrayBuffer, successCallback);
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send(null);
}

export default readWav;
