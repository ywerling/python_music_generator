(() => {
  const toggle = document.querySelector("#toggleRain");
  const volume = document.querySelector("#rainVolume");
  const volumeValue = document.querySelector("#rainVolumeValue");
  const status = document.querySelector("#rainStatus");
  const rainWindow = document.querySelector("#rainWindow");

  if (!toggle || !volume) return;

  let audioContext;
  let rainSource;
  let rainGain;
  let dropletTimer;
  let isPlaying = false;

  function makeNoiseBuffer() {
    const frameCount = audioContext.sampleRate * 3;
    const buffer = audioContext.createBuffer(2, frameCount, audioContext.sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const samples = buffer.getChannelData(channel);
      let previous = 0;

      for (let index = 0; index < frameCount; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * .72 + white * .28;
        samples[index] = previous;
      }
    }
    return buffer;
  }

  function createRainBed() {
    rainSource = audioContext.createBufferSource();
    const highPass = audioContext.createBiquadFilter();
    const lowPass = audioContext.createBiquadFilter();
    rainGain = audioContext.createGain();

    rainSource.buffer = makeNoiseBuffer();
    rainSource.loop = true;
    highPass.type = "highpass";
    highPass.frequency.value = 650;
    lowPass.type = "lowpass";
    lowPass.frequency.value = 8000;
    rainGain.gain.value = Number(volume.value) / 100;

    rainSource.connect(highPass).connect(lowPass).connect(rainGain).connect(audioContext.destination);
    rainSource.start();
  }

  function createDroplet() {
    if (!isPlaying || Math.random() < .35) return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const dropGain = audioContext.createGain();
    const panner = audioContext.createStereoPanner();
    const baseFrequency = 900 + Math.random() * 2100;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(baseFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(baseFrequency * .48, now + .075);
    dropGain.gain.setValueAtTime(0.0001, now);
    dropGain.gain.exponentialRampToValueAtTime(.025 + Math.random() * .035, now + .008);
    dropGain.gain.exponentialRampToValueAtTime(.0001, now + .11);
    panner.pan.value = Math.random() * 1.6 - .8;

    oscillator.connect(dropGain).connect(panner).connect(rainGain);
    oscillator.start(now);
    oscillator.stop(now + .12);
  }

  async function start() {
    audioContext ??= new AudioContext();
    createRainBed();
    await audioContext.resume();
    isPlaying = true;
    dropletTimer = window.setInterval(createDroplet, 115);
    render();
  }

  function stop() {
    window.clearInterval(dropletTimer);
    rainSource?.stop();
    rainSource?.disconnect();
    rainGain?.disconnect();
    rainSource = null;
    rainGain = null;
    isPlaying = false;
    render();
  }

  function render() {
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    rainWindow.classList.toggle("is-raining", isPlaying);
    toggle.querySelector(".play-icon").textContent = isPlaying ? "■" : "▶";
    toggle.querySelector(".button-label").textContent = isPlaying ? "Stop listening" : "Start listening";
    status.textContent = isPlaying ? "Rain is falling" : "The night is still";
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
    if (rainGain && audioContext) {
      rainGain.gain.setTargetAtTime(Number(volume.value) / 100, audioContext.currentTime, .03);
    }
  });

  window.addEventListener("pagehide", () => {
    if (isPlaying) stop();
    audioContext?.close();
  });
})();
