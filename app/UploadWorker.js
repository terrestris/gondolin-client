/**
 * Entry point to start upload.
 * @param {Message} event the web worker message from the main thread
 */
onmessage = event => {
  const data = event.data;
  const ws = new WebSocket(data[0]);
  const file = data[1];
  const fileSize = file.size;
  let lastProgress;

  /**
   *
   * @param {Integer} bufferedAmount The buffered amount of the websocket.
   * Receives the current bufferedAmount of the websocket.
   *
   * Inspired by https://stackoverflow.com/a/43830624/10342669
   */
  const updateProgress = bufferedAmount => {
    if (bufferedAmount > 0) {
      const loaded = fileSize - bufferedAmount;
      const uploadProgress = Math.round((loaded * 100) / fileSize );
      if (uploadProgress !== lastProgress) {
        postMessage(uploadProgress);
        lastProgress = uploadProgress;
      }
    }
  };

  ws.onopen = () => {
    let cur = 0;

    // Split the file in ~100 parts
    const chunkSize = Math.floor(fileSize / 100);

    while (cur < fileSize) {
      const sliceSize = Math.min(cur + chunkSize, fileSize);
      const blob = file.slice(cur, sliceSize);
      ws.send(blob);
      cur += chunkSize;
    }

    const interval = setInterval(() => {
      if (ws.bufferedAmount > 0) {
        updateProgress(ws.bufferedAmount);
      } else {
        updateProgress(100);
        clearInterval(interval);
        ws.close();
      }
    }, 100);

    ws.onclose = () => {
      postMessage({
        finishedUpload: true
      });
    };
  };
};
