(() => {
  const toggle = document.querySelector("#toggleMeditation");
  const volume = document.querySelector("#meditationVolume");
  const volumeValue = document.querySelector("#meditationVolumeValue");
  const status = document.querySelector("#meditationStatus");
  const visual = document.querySelector("#bowlVisual");

  if (!toggle || !volume) return;

  const bowlNotes = [174.61, 220, 261.63, 293.66, 329.63];
  let audioContext;
  let masterGain;
  let droneNodes = [];
  let bowlTimer;
  let isPlaying = false;

  function createDrone() {
    const droneGain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    const lfo = audioContext.createOscillator();
    const lfoDepth = audioContext.createGain();

    droneGain.gain.value = .11;
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 1.2;
    lfo.frequency.value = .07;
    lfoDepth.gain.value = 85;
    lfo.connect(lfoDepth).connect(filter.frequency);
    filter.connect(droneGain).connect(masterGain);

    [55, 82.41, 110].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const voiceGain = audioContext.createGain();
      oscillator.type = index === 0 ? "sine" : "triangle";
      oscillator.frequency.value = frequency;
      oscillator.detune.value = index * 3 - 3;
      voiceGain.gain.value = index === 0 ? .65 : .18;
      oscillator.connect(voiceGain).connect(filter);
      oscillator.start();
      droneNodes.push(oscillator, voiceGain);
    });

    lfo.start();
    droneNodes.push(lfo, lfoDepth, filter, droneGain);
  }

  function strikeBowl() {
    if (!isPlaying) return;

    const now = audioContext.currentTime;
    const fundamental = bowlNotes[Math.floor(Math.random() * bowlNotes.length)];
    const strikeGain = audioContext.createGain();
    const panner = audioContext.createStereoPanner();
    const partials = [
      { ratio: 1, level: .15, decay: 7.5 },
      { ratio: 2.01, level: .055, decay: 5.2 },
      { ratio: 2.98, level: .025, decay: 3.8 },
      { ratio: 4.12, level: .012, decay: 2.6 },
    ];

    strikeGain.gain.value = 1;
    panner.pan.value = Math.random() * 1.2 - .6;
    strikeGain.connect(panner).connect(masterGain);

    partials.forEach(({ ratio, level, decay }) => {
      const oscillator = audioContext.createOscillator();
      const partialGain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = fundamental * ratio;
      oscillator.detune.value = Math.random() * 5 - 2.5;
      partialGain.gain.setValueAtTime(.0001, now);
      partialGain.gain.exponentialRampToValueAtTime(level, now + .012);
      partialGain.gain.exponentialRampToValueAtTime(.0001, now + decay);
      oscillator.connect(partialGain).connect(strikeGain);
      oscillator.start(now);
      oscillator.stop(now + decay + .1);
    });

    visual.classList.remove("is-struck");
    requestAnimationFrame(() => visual.classList.add("is-struck"));
    bowlTimer = window.setTimeout(strikeBowl, 5500 + Math.random() * 4500);
  }

  async function start() {
    audioContext ??= new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = Number(volume.value) / 100;
    masterGain.connect(audioContext.destination);
    createDrone();
    await audioContext.resume();
    isPlaying = true;
    render();
    strikeBowl();
  }

  function stop() {
    window.clearTimeout(bowlTimer);
    droneNodes.forEach((node) => {
      try {
        node.stop?.();
        node.disconnect();
      } catch {
        // A node may already have stopped during page cleanup.
      }
    });
    masterGain?.disconnect();
    droneNodes = [];
    masterGain = null;
    isPlaying = false;
    visual.classList.remove("is-struck");
    render();
  }

  function render() {
    toggle.classList.toggle("is-playing", isPlaying);
    toggle.setAttribute("aria-pressed", String(isPlaying));
    visual.classList.toggle("is-playing", isPlaying);
    toggle.querySelector(".play-icon").textContent = isPlaying ? "■" : "▶";
    toggle.querySelector(".button-label").textContent = isPlaying ? "End soundscape" : "Begin soundscape";
    status.textContent = isPlaying ? "The soundscape is unfolding" : "Ready for a quiet moment";
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
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(Number(volume.value) / 100, audioContext.currentTime, .04);
    }
  });

  window.addEventListener("pagehide", () => {
    if (isPlaying) stop();
    audioContext?.close();
  });
})();
