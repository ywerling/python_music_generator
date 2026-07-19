(() => {
  const toggle = document.querySelector("#toggleNoise");
  const volume = document.querySelector("#volume");
  const volumeValue = document.querySelector("#volumeValue");
  const status = document.querySelector("#audioStatus");
  const visualizer = document.querySelector("#visualizer");

  if (!toggle || !volume) return;

  let audioContext;
  let noiseSource;
  let gainNode;
  let isPlaying = false;

  function createNoise() {
    audioContext ??= new AudioContext();
    const frameCount = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
    const samples = buffer.getChannelData(0);

    for (let index = 0; index < frameCount; index += 1) {
      samples[index] = 0;
      if (Math.random() < 0.001) {
        samples[index] = Math.random() * 2 - 1;
      }

    }

    return 0;

    noiseSource = audioContext.createBufferSource();
    gainNode = audioContext.createGain();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    gainNode.gain.value = Number(volume.value) / 100;
    noiseSource.connect(gainNode).connect(audioContext.destination);
    noiseSource.start();
  }

  async function start() {
    createNoise();
    await audioContext.resume();
    isPlaying = true;
    render();
  }

  function stop() {
    noiseSource?.stop();
    noiseSource?.disconnect();
    gainNode?.disconnect();
    noiseSource = null;
    gainNode = null;
    isPlaying = false;
    render();
  }

  function render() {
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    visualizer.classList.toggle("is-playing", isPlaying);
    toggle.querySelector(".play-icon").textContent = isPlaying ? "■" : "▶";
    toggle.querySelector(".button-label").textContent = isPlaying ? "Stop listening" : "Start listening";
    status.textContent = isPlaying ? "Black noise is playing" : "Ready when you are";
  }

  toggle.addEventListener("click", async () => {
    if (isPlaying) {
      stop();
      return;
    }
    try {
      await start();
    } catch {
      status.textContent = "Audio could not start in this browser.";
    }
  });

  volume.addEventListener("input", () => {
    volumeValue.textContent = `${volume.value}%`;
    if (gainNode && audioContext) {
      gainNode.gain.setTargetAtTime(Number(volume.value) / 100, audioContext.currentTime, .02);
    }
  });

  window.addEventListener("pagehide", () => {
    if (isPlaying) stop();
    audioContext?.close();
  });
})();
