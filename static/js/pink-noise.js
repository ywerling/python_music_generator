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
  let b0 = 0.0;
  let b1 = 0.0;
  let b2 = 0.0;
  let b3 = 0.0;
  let b4 = 0.0;
  let b5 = 0.0;
  let b6 = 0.0;
  let white = 0.0;

  function createNoise() {
    audioContext ??= new AudioContext();
    const frameCount = audioContext.sampleRate * 2;
    const buffer = audioContext.createBuffer(1, frameCount, audioContext.sampleRate);
    const samples = buffer.getChannelData(0);

    for (let index = 0; index < frameCount; index += 1) {
      white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;

      pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;

      b6 = white * 0.115926;

      samples[index] = pink * 0.11;  // Normalize roughly to [-1, 1]
    }

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
    status.textContent = isPlaying ? "Pink noise is playing" : "Ready when you are";
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
